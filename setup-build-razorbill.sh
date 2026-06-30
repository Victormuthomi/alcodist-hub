#!/bin/bash
set -e

echo "=== 1️⃣ Installing Java 17 ==="
sudo apt update
sudo apt install -y openjdk-17-jdk unzip wget

echo "Java version:"
java -version

echo "=== 2️⃣ Setting JAVA_HOME ==="
JAVA_HOME_PATH=$(dirname $(dirname $(readlink -f $(which javac))))
echo "export JAVA_HOME=$JAVA_HOME_PATH" >> ~/.bashrc
echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc
source ~/.bashrc

echo "=== 3️⃣ Installing Android SDK Command-Line Tools ==="
mkdir -p ~/Android/Sdk/cmdline-tools
cd ~/Android/Sdk
wget https://dl.google.com/android/repository/commandlinetools-linux-108809.zip -O cmdline-tools.zip
unzip -q cmdline-tools.zip
rm cmdline-tools.zip
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/

echo "=== 4️⃣ Setting Android environment variables ==="
echo "export ANDROID_SDK_ROOT=$HOME/Android/Sdk" >> ~/.bashrc
echo "export PATH=\$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:\$PATH" >> ~/.bashrc
echo "export PATH=\$ANDROID_SDK_ROOT/platform-tools:\$PATH" >> ~/.bashrc
source ~/.bashrc

echo "=== 5️⃣ Installing SDK components ==="
sdkmanager --sdk_root=$HOME/Android/Sdk "platform-tools" "platforms;android-33" "build-tools;33.0.2"

echo "=== 6️⃣ Creating local.properties for Capacitor Android project ==="
ANDROID_PROJECT_PATH="./android"
mkdir -p $ANDROID_PROJECT_PATH
echo "sdk.dir=$HOME/Android/Sdk" > $ANDROID_PROJECT_PATH/local.properties

echo "=== 7️⃣ Cleaning previous builds ==="
cd $ANDROID_PROJECT_PATH
./gradlew clean

echo "=== 8️⃣ Building debug APK ==="
./gradlew assembleDebug

APK_PATH="$ANDROID_PROJECT_PATH/app/build/outputs/apk/debug/app-debug.apk"
echo "✅ Build finished!"
echo "Your debug APK is here: $APK_PATH"

