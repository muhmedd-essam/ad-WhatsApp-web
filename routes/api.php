<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Contact\ContactController;
// use App\Http\Controllers\Api\MediaController;
// use App\Http\Controllers\Api\MediaController\MediaController;
use App\Http\Controllers\Api\Number\NumberController;
use App\Http\Controllers\Api\Number\WhatsAppController;
use App\Http\Controllers\Api\Whatsapp\AutoReplyController;
use App\Http\Controllers\Api\Whatsapp\CampaignController;
use App\Http\Controllers\Api\Whatsapp\ConversationController;
use App\Http\Controllers\Api\Whatsapp\EmployeeController;
use App\Http\Controllers\Api\Whatsapp\MessageController;
use App\Http\Controllers\Api\Whatsapp\SmartBotController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group(['prefix' => '/auth'], function () {
    Route::controller(AuthController::class)->group(function () {

        //UnAuthenticated ROUTES
        Route::post('/register', [AuthController::class, 'store'])->name('register');
        Route::post('/login', [AuthController::class, 'login'])->name('user-login');

        Route::post( '/employee/login', [AuthController::class, 'loginEmployee'])->name('employee-login');


        // Route::post('/register', 'store')->name('register')->middleware('guest');

        // Route::post('/login', 'login')->name('user-login')->middleware('guest');

        //Authenticated ROUTES
        Route::group(['middleware' => ['auth', 'ban','throttle:api']], function () {

            Route::post('/me', 'me')->middleware('auth')->name('auth.me');

            Route::post('/logout', 'logout')->middleware('auth')->name('auth.logout');

            Route::post('/change-password', 'changePassword')->middleware('auth')->name('auth.change-password');
        });
    });
});


Route::group(['prefix' => '/user'], function () {
    Route::controller(UserController::class)->group(function () {
        Route::group(['middleware' => ['auth', 'ban','throttle:api']], function () {

            Route::get('/all', 'index')->name('user.find-userWhitNumbers');

            Route::get('/', 'show')->name('user.find-userWhitNumbers');

            Route::post('/update', 'update')->name('user.find-userWhitNumbers');

        });


    });
});

Route::group(['prefix' => '/number'], function () {
    Route::controller(NumberController::class)->group(function () {
        Route::group(['middleware' => ['auth','throttle:api']], function () {

            Route::get('/{id}', 'show')->name('user.find-numberWhitplan');

            Route::post('/store', 'store')->name('user.store-number');

        });
    });
});


Route::group(['prefix' => '/media'], function () {
                

    Route::controller(MediaController::class)->group(function () {
        Route::get('/show-one-media/{id}', 'showOneMedia')->name('user.find-numberWhitplan');
        Route::group(['middleware' => ['auth','throttle:api']], function () {

            Route::get('/{id}', 'show')->name('user.find-numberWhitplan');
            
            Route::post('/all-data', 'index')->name('user.find');


            Route::post('/store', 'storeMedia')->name('user.store-media');

            Route::delete('/delete/{id}', 'deleteMedia')->name('user.delete-media');
            
            Route::put('/update/{id}', [MediaController::class, 'updateMedia']);
            
            

        });
    });
});


Route::group(['prefix' => '/whatsapp'], function () {
    Route::post('/receive-message', [WhatsAppController::class, 'handleIncomingMessage']);
    Route::post('/send-message', [WhatsAppController::class, 'sendMessage']);
    Route::post('/send-message-to-numbers', [WhatsAppController::class, 'sendMessageToNumbers']);
    Route::controller(WhatsAppController::class)->group(function () {
        Route::group(['middleware' => ['auth','throttle:api']], function () {



            // Send a message to multiple recipients
            Route::post('/send-multiple-messages', [WhatsAppController::class, 'sendMessageToMultipleRecipients']);

            // Set auto-reply
            Route::post('/set-auto-reply', [WhatsAppController::class, 'setAutoReply']);

            // Manage WhatsApp account
            Route::post('/manage-account', [WhatsAppController::class, 'manageWhatsAppAccount']);

            // Manage contact list
            Route::post('/manage-contact', [WhatsAppController::class, 'manageContactList']);

            // Use smart bot
            Route::post('/smart-bot', [WhatsAppController::class, 'useSmartBot']);

        });
    });
});


Route::group(['prefix' => '/contacts'], function () {
    Route::controller(ContactController::class)->group(function () {
        Route::group(['middleware' => ['auth','throttle:api']], function () {

            Route::post('/import', [ContactController::class, 'importContacts'])->name('contacts.import');
            Route::get('/all', [ContactController::class, 'index'])->name('contacts.index');
            Route::get('/{id}', [ContactController::class, 'show'])->name('contacts.show');
            Route::post('/update', [ContactController::class, 'updateContacts'])->name('contacts.update');
            Route::delete('/delete/{id}', [ContactController::class, 'delete'])->name('contacts.delete');
            Route::post('/list/delete', [ContactController::class, 'destroyListContacts'])->name('contacts.delete');


        });
    });
});



Route::group(['prefix' => '/conversation'], function () {
    Route::controller(ConversationController::class)->group(function () {
        Route::group(['middleware' => ['auth','throttle:api']], function () {

            Route::get('/all', [ConversationController::class, 'index']);
            Route::post('/store', [ConversationController::class, 'store']);
            Route::get('/show/{id}', [ConversationController::class, 'show']);
            Route::post('/update/{id}', [ConversationController::class, 'update']);
            Route::delete('/delete/{id}', [ConversationController::class, 'destroy']);

        });
    });
});


Route::group(['prefix' => '/message'], function () {
    Route::controller(MessageController::class)->group(function () {
        Route::group(['middleware' => ['auth','throttle:api']], function () {

            Route::get('/all', [MessageController::class, 'index']);
            Route::post('/store', [MessageController::class, 'store']);
            Route::get('/show/{id}', [MessageController::class, 'show']);
            Route::post('/update/{id}', [MessageController::class, 'update']);
            Route::delete('/delete/{id}', [MessageController::class, 'destroy']);




            Route::get('/campaigns/{campaignId}', [MessageController::class, 'indexMessageCampaign']);
            Route::post('/campaigns/{campaignId}', [MessageController::class, 'storeMessageCampaign']);
            Route::get('/campaigns/{campaignId}/{messageId}', [MessageController::class, 'showMessageCampaign']);
            Route::delete('/campaigns/{campaignId}/{messageId}', [MessageController::class, 'destroyMessageCampaign']);

        });
    });
});

Route::post('/receive', [MessageController::class, 'receive']);



Route::group(['prefix' => '/campaign'], function () {
    Route::controller(CampaignController::class)->group(function () {
        Route::group(['middleware' => ['auth','throttle:api']], function () {

            Route::get('/all', [CampaignController::class, 'index']);
            Route::post('/store', [CampaignController::class, 'store']);
            Route::get('/show/{campaign}', [CampaignController::class, 'show']);
            Route::put('/update/{campaign}', [CampaignController::class, 'update']);
            Route::delete('/delete/{campaign}', [CampaignController::class, 'destroy']);

        });
    });
});



Route::group(['prefix' => '/employee'], function () {
    Route::controller(EmployeeController::class)->group(function () {
        Route::group(['middleware' => ['auth','throttle:api']], function () {

            Route::get('/all', [EmployeeController::class, 'index']);
            Route::post('/store', [EmployeeController::class, 'store']);
            Route::get('/show/{id}', [EmployeeController::class, 'show']);
            Route::post('/update/{id}', [EmployeeController::class, 'update']);
            Route::delete('/delete/{id}', [EmployeeController::class, 'destroy']);

        });
    });
});



Route::group(['prefix' => '/smart-bots'], function () {
    Route::controller(SmartBotController::class)->group(function () {
        Route::group(['middleware' => ['auth','throttle:api']], function () {
            Route::get('/all', [SmartBotController::class, 'index']);
            Route::post('/store', [SmartBotController::class, 'store']); // لإنشاء روبوت جديد
            Route::get('/show/{id}', [SmartBotController::class, 'show']); // لعرض روبوت معين
            Route::post('/update/{id}', [SmartBotController::class, 'update']); // لتحديث روبوت معين
            Route::delete('/delete/{id}', [SmartBotController::class, 'destroy']);
            Route::put('/change-status/{id}', [SmartBotController::class, 'changeStatus']);
            // Route::post('/change-status/{id}', 'changeStatus');
            

        });
    });
});


Route::group(['prefix' => '/ticket'], function () {
    Route::controller(TicketController::class)->group(function () {
        Route::group(['middleware' => ['auth', 'ban','throttle:api']], function () {

            Route::post('/store', [TicketController::class, 'store']); // لإنشاء شكوى جديد
            Route::get('/show/{id}', [TicketController::class, 'show']); // لعرض شكوى معين
            Route::get('/all/{id}', [TicketController::class, 'index']);

            // Route::post('/update/{id}', [TicketController::class, 'update']); // لتحديث روبوت معين
            // Route::delete('/delete/{id}', [TicketController::class, 'destroy']);

        });
    });
});

Route::group(['prefix' => '/auto-replies'], function () {
    Route::controller(AutoReplyController::class)->group(function () {
        Route::group(['middleware' => ['auth', 'throttle:api']], function () {
            // تخزين رد آلي جديد
            Route::post('/store', 'store');

            // تحديث الرد الآلي
            Route::post('/update/{smartBotId}', 'update');

            // جلب بيانات الرد الآلي
            Route::get('/show/{smartBotId}', 'show');
            
            Route::get('/all', 'index');
            
            Route::post('/change-status/{id}', 'changeStatus');
            
            Route::delete('/delete/{id}', [AutoReplyController::class, 'destroy']);
        });
    });
});
