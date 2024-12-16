<?php

namespace App\Http\Controllers;

use App\Traits\WebTrait;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\Media;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\File;


class MediaController extends Controller
{
    use WebTrait;
    
 public function storeMedia(Request $request)
    {
        $user = auth()->user();

        $userWithPlan = User::with('plan')->where('id', $user->id)->first();
        $plan = $userWithPlan->plan;
        


        $countSize = Media::countMediasBetween($user->plan_time_starts, $user->plan_time_ends);
        
        // dd($countSize);

        if($countSize >=$plan->storage_size_mb){
            return response()->json(['success' => false, 'error' => 'media storage is full'], 500);

        }

        $rules = [
            'user_id' => ['required', 'exists:users,id'],
            'type' => ['required', 'string'],
            'path' => ['required', 'file'],
        ];



        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {

            if($request->hasFile('path')){

                $profileImage = Storage::disk('public')->putFile('images/users/media', new File($request->path));


                $request->request->add(['path' => $profileImage]);
                $fileSize = $request->file('path')->getSize();
                
                $fileSizeInMB = $fileSize / (1024 * 1024);
                // dd($fileSizeFormatted);
// dd($fileSizeFormatted);
                if (floatval($fileSizeInMB) > $plan->max_file_size_mb) {
                    return response()->json(['success' => false, 'error' => 'your plan can not upoald file bigger than '.$plan->max_file_size_mb .' mb' ], 500);
                }
// dd($fileSizeFormatted);
                $media = Media::create([
                    'user_id' => $request->user_id,
                    'type' => $request->type,
                    'path' => $profileImage,
                    'size' => $fileSizeInMB
                ]);
                
                $media->yourSizeCount = $countSize . ' mb';
                $media->yourFreeSize = ($plan->storage_size_mb - $countSize) . ' mb';
                return $this->success($media);
            }

            $media = Media::create([
                'user_id' => $request->user_id,
                'type' => $request->type,
                'path' => $request->path,
            ]);

            // $media =;

            return $this->success();

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'هناك خطأ',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteMedia($id)
    {
        try {
            // Find the media by ID
            $media = Media::find($id);

            if (!$media) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Media not found.',
                ], 404);
            }

            // Delete the media record from the database
            $media->delete();

            return $this->success('Media deleted successfully!');

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'There was an error deleting the media.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function show($id)
    {
        try {
            $currentUser = auth()->user();

            $user = User::findOrFail($id);
            // dd($user);
            $media = Media::where('user_id', $id)->get();

            if($currentUser->id != $user->id){
                return $this->error(404, 'User is not for you');
            }

        } catch (ModelNotFoundException $e) {
            return $this->error(404, 'User not found');
        }


        return $this->data($media, 'User retrieved successfully!');
    }
    
    public function showOneMedia($id)
    {
        try {
            $currentUser = auth()->user();

            // $user = User::findOrFail($id);
            // dd($user);
$media = Media::findOrFail($id);
            // if($currentUser->id != $user->id){
            //     return $this->error(404, 'User is not for you');
            // }

        } catch (ModelNotFoundException $e) {
            return $this->error(404, 'media not found');
        }


        return $this->data($media, 'User retrieved successfully!');
    }
    
    public function index()
    {
        try {
            
        $currentUser = auth()->user();


            // dd($user);
            $media = Media::where('user_id', $currentUser->id)->get();

            // if($currentUser->id != $currentUser->id){
            //     return $this->error(404, 'User is not for you');
            // }
            

        $userWithPlan = User::with('plan')->where('id', $currentUser->id)->first();
        $plan = $userWithPlan->plan;
        


        $countSize = Media::countMediasBetween($currentUser->plan_time_starts, $currentUser->plan_time_ends);
        
        //         foreach ($media as $item) {
        //     $item->yourSizeCount = $countSize . ' mb';
        //     $item->yourFreeSize = ($plan->storage_size_mb - $countSize) . ' mb';
            
        // }
             return response()->json(['success' => True, 'yourSizeCount' => $countSize  , 'yourFreeSize'=>($plan->storage_size_mb - $countSize)  , 'yourLimit'=> $plan->storage_size_mb,'data' => $media]);
        } catch (ModelNotFoundException $e) {
            return $this->error(404, 'User not founds');
        }


        
    }
    
    public function updateMedia(Request $request, $id)
{
    // Validate the request to ensure name is provided and it's a string
    $request->validate([
        'name' => ['required', 'string', 'max:255'],
    ]);

    try {
        // Find the media by ID
        $media = Media::find($id);

        // Check if media exists
        if (!$media) {
            return response()->json([
                'status' => 'error',
                'message' => 'Media not found',
            ], 404);
        }

        // Update only the name
        $media->name = $request->name;
        $media->save();

        // Return success message
        return response()->json([
            'status' => 'success',
            'message' => 'Media name updated successfully',
            'data' => $media,
        ], 200);

    } catch (\Exception $e) {
        // Handle errors and return error message
        return response()->json([
            'status' => 'error',
            'message' => 'There was an error updating the media name',
            'error' => $e->getMessage(),
        ], 500);
    }
}

}

