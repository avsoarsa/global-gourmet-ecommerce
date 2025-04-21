#!/bin/bash

# Update mobile menu links
sed -i '' 's/className={`${isScrolled ? '\''text-gray-700 hover:text-green-600'\'' : '\''text-white hover:text-white\/80'\''} font-medium pl-2 border-l-4 border-transparent hover:border-l-4 hover:border-green-500 transition-all duration-300 py-2 flex items-center`}/className="text-gray-700 hover:text-green-600 font-medium pl-2 border-l-4 border-transparent hover:border-l-4 hover:border-green-500 transition-all duration-300 py-2 flex items-center"/g' src/components/layout/Header.jsx

# Update mobile menu icon containers
sed -i '' 's/className={`${isScrolled ? '\''bg-green-100\/50'\'' : '\''bg-white\/10'\''} p-1.5 rounded-full mr-3`}/className="bg-green-100\/50 p-1.5 rounded-full mr-3"/g' src/components/layout/Header.jsx

# Update mobile menu icon colors
sed -i '' 's/className={`${isScrolled ? '\''text-green-600'\'' : '\''text-white'\''} text-sm`}/className="text-green-600 text-sm"/g' src/components/layout/Header.jsx

# Update mobile search input
sed -i '' 's/className={`form-input w-full pl-10 pr-4 py-2 rounded-full ${!isScrolled && '\''bg-white\/10 border-white\/20 text-white placeholder-white\/70'\''}`}/className="form-input w-full pl-10 pr-4 py-2 rounded-full"/g' src/components/layout/Header.jsx

# Update mobile search icon
sed -i '' 's/className={`absolute left-3 top-1\/2 transform -translate-y-1\/2 ${isScrolled ? '\''text-gray-400'\'' : '\''text-white\/70'\''}`}/className="absolute left-3 top-1\/2 transform -translate-y-1\/2 text-gray-400"/g' src/components/layout/Header.jsx

# Update language text
sed -i '' 's/className={`text-sm font-medium mb-2 ${isScrolled ? '\''text-gray-700'\'' : '\''text-white\/80'\''}`}/className="text-sm font-medium mb-2 text-gray-700"/g' src/components/layout/Header.jsx

# Update language buttons
sed -i '' 's/className={`px-3 py-1 text-sm rounded-md ${i18n.language === '\''en'\'' ? '\''bg-green-100 text-green-700 font-medium'\'' : `${isScrolled ? '\''bg-gray-100 text-gray-700'\'' : '\''bg-white\/10 text-white'\''}`}`}/className={`px-3 py-1 text-sm rounded-md ${i18n.language === '\''en'\'' ? '\''bg-green-100 text-green-700 font-medium'\'' : '\''bg-gray-100 text-gray-700'\''}`}/g' src/components/layout/Header.jsx
sed -i '' 's/className={`px-3 py-1 text-sm rounded-md ${i18n.language === '\''es'\'' ? '\''bg-green-100 text-green-700 font-medium'\'' : `${isScrolled ? '\''bg-gray-100 text-gray-700'\'' : '\''bg-white\/10 text-white'\''}`}`}/className={`px-3 py-1 text-sm rounded-md ${i18n.language === '\''es'\'' ? '\''bg-green-100 text-green-700 font-medium'\'' : '\''bg-gray-100 text-gray-700'\''}`}/g' src/components/layout/Header.jsx
sed -i '' 's/className={`px-3 py-1 text-sm rounded-md ${i18n.language === '\''fr'\'' ? '\''bg-green-100 text-green-700 font-medium'\'' : `${isScrolled ? '\''bg-gray-100 text-gray-700'\'' : '\''bg-white\/10 text-white'\''}`}`}/className={`px-3 py-1 text-sm rounded-md ${i18n.language === '\''fr'\'' ? '\''bg-green-100 text-green-700 font-medium'\'' : '\''bg-gray-100 text-gray-700'\''}`}/g' src/components/layout/Header.jsx

# Update mobile cart and wishlist links
sed -i '' 's/className={`${isScrolled ? '\''text-gray-700 hover:text-green-700'\'' : '\''text-white hover:text-white\/80'\''} flex items-center`}/className="text-gray-700 hover:text-green-700 flex items-center"/g' src/components/layout/Header.jsx
sed -i '' 's/className={`${isScrolled ? '\''text-gray-700 hover:text-red-500'\'' : '\''text-white hover:text-red-300'\''} flex items-center`}/className="text-gray-700 hover:text-red-500 flex items-center"/g' src/components/layout/Header.jsx

# Update mobile account links
sed -i '' 's/className={`block ${isScrolled ? '\''text-gray-700 hover:text-green-700'\'' : '\''text-white hover:text-white\/80'\''}`}/className="block text-gray-700 hover:text-green-700"/g' src/components/layout/Header.jsx
sed -i '' 's/className={`${isScrolled ? '\''text-gray-700 hover:text-green-700'\'' : '\''text-white hover:text-white\/80'\''}`}/className="text-gray-700 hover:text-green-700"/g' src/components/layout/Header.jsx
