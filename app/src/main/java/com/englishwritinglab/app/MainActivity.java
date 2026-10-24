package com.englishwritinglab.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.speech.tts.TextToSpeech;
import android.os.Handler;
import android.os.Looper;
import java.util.Locale;

public class MainActivity extends Activity {
    private WebView web;
    private TextToSpeech tts;
    private final Handler main = new Handler(Looper.getMainLooper());

    public class SpeechBridge {
        @JavascriptInterface public void speak(String text, double rate, String locale) {
            main.post(() -> {
                if (tts == null || text == null || text.isEmpty()) return;
                tts.stop();
                tts.setLanguage(Locale.forLanguageTag(locale));
                tts.setSpeechRate((float)Math.max(0.5, Math.min(1.5, rate)));
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "ewl-speech");
            });
        }
        @JavascriptInterface public void stop() { main.post(() -> { if(tts != null) tts.stop(); }); }
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(0xFFF8F7FD);
        getWindow().setNavigationBarColor(0xFFF8F7FD);
        getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        web = new WebView(this);
        setContentView(web);
        tts = new TextToSpeech(this, status -> {});
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(true);
        web.getSettings().setAllowFileAccessFromFileURLs(false);
        web.getSettings().setAllowUniversalAccessFromFileURLs(false);
        web.addJavascriptInterface(new SpeechBridge(), "AndroidTTS");
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient());
        web.loadUrl("file:///android_asset/index.html");
    }

    @Override public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
    @Override protected void onDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
        if (web != null) web.destroy();
        super.onDestroy();
    }
}
