import React, { useState, useEffect, memo } from 'react';
import { Text } from './Text.js';

const spinners = {
    // --- Tes Classiques ---
    dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    arc: ['◜', '◠', '◝', '◞', '◡', '◟'],
    line: ['-', '\\', '|', '/'],

    // --- Nouveaux Styles ---
    // Phases de la lune (Ultra fluide)
    moon: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'],

    // Terre qui tourne
    earth: ['🌍', '🌎', '🌏'],

    // Croissance (Barres de hauteur croissante)
    grow: [' ', '▃', '▄', '▅', '▆', '▇', '▆', '▅', '▄', '▃'],

    // Balle qui rebondit
    bounce: ['⠁', '⠂', '⠄', '⠂'],

    // Flèche qui pointe
    arrow: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],

    // Triangle qui tourne
    triangle: ['◢', '◣', '◤', '◥']
};

export type SpinnerType = keyof typeof spinners;

interface SpinnerProps {
    type?: SpinnerType;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';
    label?: string;
}

const SpinnerInner: React.FC<SpinnerProps> = ({
    type = 'dots',
    variant = 'default',
    label
}) => {
    const [frame, setFrame] = useState(0);
    const frames = spinners[type] || spinners.dots;

    useEffect(() => {
        // On adapte la vitesse selon le type pour plus de réalisme
        const speed = type === 'earth' ? 200 : 100;

        const timer = setInterval(() => {
            setFrame((v) => (v + 1) % frames.length);
        }, speed);

        return () => clearInterval(timer);
    }, [frames, type]);

    return (
        <Text>
            <Text variant={variant === 'default' ? 'primary' : variant} bold>
                {frames[frame]}
            </Text>
            {label && <Text variant="muted"> {label}</Text>}
        </Text>
    );
};

export const Spinner = memo(SpinnerInner);
Spinner.displayName = 'Spinner';
