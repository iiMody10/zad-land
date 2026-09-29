<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UploadController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/uploads/{path}', [UploadController::class, 'show'])->where('path', '.*');
