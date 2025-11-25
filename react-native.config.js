module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          sourceDir: '../node_modules/react-native-vector-icons/ios',
          project: 'ios/Carryo.xcodeproj',
        },
      },
    },
  },
  assets: ['./src/assets/fonts/', './src/assets/images/'],
};

