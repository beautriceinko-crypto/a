package com.beatrice.liquidglasslauncher

import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap

class LauncherModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    override fun getName(): String = "LauncherModule"

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
            val apps = context.packageManager.queryIntentActivities(intent, 0)
                .map { resolveInfo ->
                    val map = WritableNativeMap()
                    map.putString("packageName", resolveInfo.activityInfo.packageName)
                    map.putString("label", resolveInfo.loadLabel(context.packageManager).toString())
                    map
                }
                .distinctBy { it.getString("packageName") }
                .sortedBy { it.getString("label")?.lowercase() }

            val result: WritableArray = WritableNativeArray()
            apps.forEach { result.pushMap(it) }
            promise.resolve(result)
        } catch (error: Exception) {
            promise.reject("APPS_ERROR", error)
        }
    }

    @ReactMethod
    fun launchApp(packageName: String, promise: Promise) {
        try {
            val launchIntent = context.packageManager.getLaunchIntentForPackage(packageName)
                ?: throw IllegalArgumentException("No launch intent for $packageName")
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(launchIntent)
            promise.resolve(true)
        } catch (error: Exception) {
            promise.reject("LAUNCH_ERROR", error)
        }
    }
}
