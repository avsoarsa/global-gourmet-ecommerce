import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useRegion } from '../../context/RegionContext';

const RegionSelector = ({ compact = false }) => {
  const { t } = useTranslation();
  const { region, changeRegion, availableRegions } = useRegion();
  const [isOpen, setIsOpen] = useState(false);

  const regionFlags = {
    US: '🇺🇸',
    ES: '🇪🇸',
    FR: '🇫🇷',
    GB: '🇬🇧',
    CA: '🇨🇦',
    IN: '🇮🇳',
    AU: '🇦🇺',
    JP: '🇯🇵'
  };

  const regionNames = {
    US: t('regions.unitedStates', 'United States'),
    ES: t('regions.spain', 'Spain'),
    FR: t('regions.france', 'France'),
    GB: t('regions.unitedKingdom', 'United Kingdom'),
    CA: t('regions.canada', 'Canada'),
    IN: t('regions.india', 'India'),
    AU: t('regions.australia', 'Australia'),
    JP: t('regions.japan', 'Japan')
  };

  const handleRegionChange = (newRegion) => {
    changeRegion(newRegion);
    setIsOpen(false);
  };

  // Compact version (for mobile or header)
  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-gray-700 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="mr-1">{regionFlags[region]}</span>
          <FontAwesomeIcon icon={faChevronDown} className="text-xs ml-1" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            ></div>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              {availableRegions.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRegionChange(r)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <span className="mr-2">{regionFlags[r]}</span>
                    {regionNames[r]}
                  </span>
                  {region === r && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-3 flex items-center">
        <FontAwesomeIcon icon={faGlobe} className="mr-2 text-green-600" />
        {t('common.selectRegion', 'Select Region')}
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {availableRegions.map((r) => (
          <button
            key={r}
            onClick={() => handleRegionChange(r)}
            className={`flex items-center justify-between px-4 py-2 rounded-md transition-colors ${
              region === r
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <span className="flex items-center">
              <span className="text-xl mr-3">{regionFlags[r]}</span>
              <span>{regionNames[r]}</span>
            </span>
            {region === r && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionSelector;
