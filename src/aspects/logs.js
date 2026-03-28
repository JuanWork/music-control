const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

// 1. ABASTRAÇÃO DE PLAYER (O "Coringa" Universal)
const getMusicCommand = (action) => {
    const platform = os.platform(); // 'linux', 'darwin' (Mac) ou 'win32' (Windows)

    // Mapeamento de comandos por Sistema
    const commands = {
        linux: {
            next: 'rhythmbox-client --next || playerctl next || vlc-ctrl next',
            play: 'rhythmbox-client --play || playerctl play || vlc-ctrl play'
        },
        darwin: { // Mac OS
            next: `osascript -e 'tell application "Music" to next track'`,
            play: `osascript -e 'tell application "Music" to play'`
        },
        win32: { // Windows (Exige VLC no PATH ou comandos de mídia nativos)
            next: 'powershell -command "Status: Próxima Faixa"', // Placeholder para integração Win
            play: 'powershell -command "Status: Reproduzir"'
        }
    };

    return commands[platform]?.[action] || 'echo "Plataforma não suportada para controle de mídia"';
};

const aspectHumor = (status) => {
    const logPath = path.join(__dirname, '..', 'data', 'logs.json');
    const data = JSON.parse(fs.readFileSync(logPath, 'utf8'));

    if (status === 'nó') {
        // Ação: Tenta o "Next" no player disponível
        exec(getMusicCommand('next'));
        data.session_logs.push({
            timestamp: new Date().toISOString(),
            event: "Nó no desenvolvimento",
            status: "error",
            mood: "adrenalina",
            message: "IA e Dev em sintonia: Superando o bloqueio!"
        });
    } else {
        // Ação: Tenta o "Play" no player disponível
        exec(getMusicCommand('play'));
        data.session_logs.push({
            timestamp: new Date().toISOString(),
            event: "Conquista",
            status: "success",
            mood: "calma",
            message: "Humanização completa. Código fluido."
        });
    }

    fs.writeFileSync(logPath, JSON.stringify(data, null, 2));
    console.log(`\n[Universal Flow] Plataforma: ${os.platform()} | Status: ${status.toUpperCase()}`);
};

// Teste
aspectHumor('sucesso');



module.exports = aspectHumor;
