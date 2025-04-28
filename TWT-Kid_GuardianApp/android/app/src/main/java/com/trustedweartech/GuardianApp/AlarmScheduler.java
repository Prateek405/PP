// package com.trustedweartech.TwKidsApp;

// import android.annotation.SuppressLint;
// import android.app.AlarmManager;
// import android.app.PendingIntent;
// import android.content.Context;
// import android.content.Intent;
// import android.os.SystemClock;
// import android.util.Log;

// public class AlarmScheduler {
//     Context context;
//     private final String TAG = this.getClass().getName();

//     @SuppressLint("ShortAlarm")
//     public void startAlert(Context context) {
//         this.context = context;
//         AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
//         Intent batteryIntent = new Intent("BATTERY_ALERT");
//         Intent timeIntent = new Intent("TIME_ALERT");
//         PendingIntent pendingBatteryIntent = PendingIntent.getBroadcast(context, 0, batteryIntent, PendingIntent.FLAG_IMMUTABLE);
//         PendingIntent pendingTimeIntent = PendingIntent.getBroadcast(context, 0, timeIntent, PendingIntent.FLAG_IMMUTABLE);

//         long batteryTrigger = SystemClock.elapsedRealtime() + 5000;
//         long timeTrigger = SystemClock.elapsedRealtime() + 5000;
//         long batteryInterval = 1000;
//         long timeInterval = 1000;

//         alarmManager.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, batteryTrigger, batteryInterval, pendingBatteryIntent);
//         alarmManager.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP, timeTrigger, timeInterval, pendingTimeIntent);

//         Log.v(TAG, "Repeating alarm scheduled");
//     }
// }
