package com.igraspore.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.ValueCallback;
import android.view.WindowManager;
import android.view.View;
import android.view.KeyEvent;
import android.os.Build;
import android.graphics.Color;
import android.content.Intent;
import android.net.Uri;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        );

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#022830"));
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        }

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url == null) return false;
                if (url.startsWith("file:///android_asset/") || url.startsWith("https://igraspore.pages.dev")) {
                    view.loadUrl(url);
                    return true;
                }
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    } catch (Exception e) { }
                    return true;
                }
                return false;
            }
            @Override
            public void onPageFinished(WebView view, String url) {
                // Inject APK flag + back handler
                view.evaluateJavascript(
                    "(function(){try{window.__APK=true;document.documentElement.classList.add('is-mobile','is-apk');}catch(e){}})();",
                    null
                );
            }
        });

        webView.loadUrl("file:///android_asset/www/index.html");

        int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                  | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                  | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                  | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                  | View.SYSTEM_UI_FLAG_FULLSCREEN
                  | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
        getWindow().getDecorView().setSystemUiVisibility(flags);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            // Call JS menu toggle first
            webView.evaluateJavascript(
                "(function(){try{if(typeof window.onAndroidBack==='function'){return window.onAndroidBack();}if(typeof window.toggleGameMenu==='function'){window.toggleGameMenu();return true;}return false;}catch(e){return false;}})();",
                new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        if ("false".equals(value) && webView.canGoBack()) {
                            webView.goBack();
                        }
                    }
                }
            );
            return true; // always consume back — don't exit app accidentally
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    public void onBackPressed() {
        // handled in onKeyDown
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                      | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                      | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                      | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                      | View.SYSTEM_UI_FLAG_FULLSCREEN
                      | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
            getWindow().getDecorView().setSystemUiVisibility(flags);
        }
    }
}
