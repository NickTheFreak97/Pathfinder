export enum GenerationShape
{
    Box = 0,
    Circle,
    Regular,
    Random
}

export enum MouseMode
{
    Grab = 0,
    Force
}


// Settings
export const Settings = {
    width: 1280,
    height: 720,
    clipWidth: 12.8,
    clipHeight: 7.2,
    paused: false,
    boxCount: 15,
    genSpeed: 50,
    aabbMargin: 0.1,
    colorize: true,
    applyRotation: true,
}

export function updateSetting(id: string, content?: any)
{
    switch (id)
    {
        case "pause": { 
            Settings.paused = !Settings.paused;
            break;
        }
        case "boxCount": {
            Settings.boxCount = content!;
            break;
        }
        case "genSpeed": {
            Settings.genSpeed = content!;
            break;
        }
        case "margin": {
            Settings.aabbMargin = content!;
            break;
        }
        default:
            break;
    }
}