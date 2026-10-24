# English Writing Lab — Android Edition

Android WebView app with bundled offline English lessons, TTS and learning buddy.

## Push to GitHub (repository: Makrufkasr/test_app)

Extract the **contents of this ZIP** directly into the local `test_app` repository, so `settings.gradle`, `app/` and `.github/` are at the repository root.

```bash
git add .
git commit -m "Add English Writing Lab Android app"
git push origin main
```

## Download APK

Go to https://github.com/Makrufkasr/test_app/actions → **Build Android APK** → select the successful workflow run → under **Artifacts**, download **English-Writing-Lab-debug-APK**, extract the resulting APK and install it on your Android device.

If a workflow was not triggered automatically, use **Run workflow** on the Build Android APK workflow page.

## Requirements

GitHub Actions workflow installs Android SDK Platform 35 and uses Java 17 / Gradle 8.7. Local Android Studio builds need equivalent SDK tooling. The app bundles web assets offline. It relies on the device TTS voice package for pronunciation.

**Build has not yet been run or tested on an Android device.**
