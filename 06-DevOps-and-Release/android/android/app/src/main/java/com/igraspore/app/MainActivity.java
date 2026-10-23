package com.igraspore.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  private final androidx.activity.OnBackPressedCallback igsBack = new androidx.activity.OnBackPressedCallback(true) {
    @Override
    public void handleOnBackPressed() { sendBackToGame(); }
  };

  @Override
  public void onCreate(android.os.Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getOnBackPressedDispatcher().addCallback(this, igsBack);
  }

  @Override
  public void onResume() {
    super.onResume();
    igsBack.remove();
    getOnBackPressedDispatcher().addCallback(this, igsBack);
  }

  @Override
  @SuppressWarnings("deprecation")
  public void onBackPressed() { sendBackToGame(); }

  private void sendBackToGame() {
    android.webkit.WebView view = getBridge() != null ? getBridge().getWebView() : null;
    if (view == null) return;
    view.evaluateJavascript("if(window.igsHardwareBack)igsHardwareBack();", null);
  }
}
