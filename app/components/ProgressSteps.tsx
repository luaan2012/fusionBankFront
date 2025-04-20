// Define the Step type for the steps array
interface Step {
  id: number;
  label: string;
}

// Define the props type for ProgressSteps
interface ProgressStepsProps {
  currentStep: number;
}

const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  const steps: Step[] = [
    { id: 1, label: 'Informações' },
    { id: 2, label: 'Banco' },
    { id: 3, label: 'Acesso' },
    { id: 4, label: 'Confirmação' },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`progress-step ${currentStep === step.id ? 'active' : ''} ${
                currentStep > step.id ? 'completed' : ''
              }`}
            >
              {step.id}
            </div>
            <span
              className={`text-xs mt-2 ${
                currentStep >= step.id ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;