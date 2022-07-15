export const hpDisplayModes = [
    {
        name: 'Never Displayed',
        value: 1,
    },
    {
        name: 'When Controlled',
        value: 10,
    },
    {
        name: 'Hovered By Owner',
        value: 20,
    },
    {
        name: 'Hovered By Anyone',
        value: 30,
    },
    {
        name: 'Always For Owner',
        value: 40,
    },
    {
        name: 'Always For Everyone',
        value: 50,
    },
];

export const barBrawlHpDisplayModes = [
    {
        name: 'Never Displayed',
        value: 1,
    },
    {
        name: 'Hovered By Anyone',
        value: 30,
    },
    {
        name: 'Always For Everyone',
        value: 50,
    },
];

export const getDisplayMode = (disposition) => {
    switch(disposition){
        case -1:
            return 'hostile';
        case 0:
            return 'neutral';
        case 1:
            return 'friendly';
    }
};

export const translateCustomDisplayModes = (value, disposition, flag) => {
    const customDisplayMode = value[disposition].value;
    if(customDisplayMode === 0 && !flag){
        return undefined;
    }
    
    return customDisplayMode === 0 && flag ? flag : customDisplayMode === 1 ? 0 : customDisplayMode; 
};

export function useProjectPath(innerPath) {
    return `modules/combat-hp-display/${innerPath}`;
}

export function useTemplatesPath(innerPath) {
    return useProjectPath(`templates/${innerPath}`);
}