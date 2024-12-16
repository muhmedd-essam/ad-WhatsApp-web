<?php

use Illuminate\Support\Facades\Route;

use Illuminate\Http\Request; //
use Illuminate\Support\Facades\Http;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/send-message', function () {
    return view('send-message'); // تأكد من وجود هذه الواجهة
});

Route::post('/send-whatsapp-message', function (Request $request) {
    // تحقق من صحة البيانات
    $request->validate([
        'number' => 'required|string',
        'message' => 'required|string',
    ]);

    // إرسال طلب إلى خادم Node.js
    try {
        $response = Http::post('http://localhost:3000/send-message', [
            'number' => $request->input('number'),
            'message' => $request->input('message'),
        ]);

        // إعادة استجابة JSON من الخادم
        return $response->json();
    } catch (\Exception $e) {
        // إذا حدث خطأ، أرسل استجابة مع الخطأ
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});
