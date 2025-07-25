import { motion } from 'framer-motion';
import { ClassificationResult } from '@/pages/Index';
import { getSoundIcon } from '@/utils/soundIcons';

interface ClassificationResultsProps {
  classifications: ClassificationResult[];
}

export const ClassificationResults = ({ classifications }: ClassificationResultsProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Sound Classification</h3>
      <div className="space-y-3">
        {classifications.slice(0, 3).map((item, index) => {
          const iconData = getSoundIcon(item.label);
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{iconData.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{iconData.name}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
                <div className="text-sm font-semibold text-accent">
                  {(item.score * 100).toFixed(1)}%
                </div>
              </div>
              
              {/* Confidence bar */}
              <div className="confidence-bar h-2">
                <motion.div
                  className="confidence-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};