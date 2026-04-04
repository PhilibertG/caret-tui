import React, { useState } from 'react';
import { useInput } from 'ink';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { Badge } from './Badge.js';

interface Step {
  title: string;
  content: React.ReactNode;
}

interface StepWizardProps {
  steps: Step[];
  onComplete: () => void;
  isActive?: boolean;
}

export const StepWizard: React.FC<StepWizardProps> = ({ steps, onComplete, isActive = true }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  useInput((input, key) => {
    if (!isActive) return;
    const cmd = input.toLowerCase();
    if (cmd === 'n') next();
    if (cmd === 'p') prev();
    if (key.rightArrow) next();
    if (key.leftArrow) prev();
  }, { isActive });

  return (
    <Box flexDirection="column" gap={1}>
      {/* Progress Tracker */}
      <Box gap={2} marginBottom={1}>
        {steps.map((step, i) => (
          <Box key={i} gap={1}>
            <Badge variant={i === currentStep ? 'primary' : (i < currentStep ? 'success' : 'secondary')}>
              {`${i + 1}`}
            </Badge>
            <Text bold={i === currentStep} color={i === currentStep ? 'white' : undefined}>
              {step.title}
            </Text>
            {i < steps.length - 1 && <Text variant="muted">→</Text>}
          </Box>
        ))}
      </Box>

      {/* Content */}
      <Box borderStyle="single" borderColor="#262626" padding={1} minHeight={6}>
        {steps[currentStep].content}
      </Box>

      {/* Controls */}
      <Box gap={2} marginTop={1}>
        {currentStep > 0 && (
          <Box gap={1}>
            <Text bold color="white">[P]</Text>
            <Text variant="muted">Previous</Text>
          </Box>
        )}
        <Box gap={1}>
          <Text bold color="white">[N]</Text>
          <Text variant="muted">{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</Text>
        </Box>
      </Box>
    </Box>
  );
};

