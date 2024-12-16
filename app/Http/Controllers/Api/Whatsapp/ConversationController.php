<?php

namespace App\Http\Controllers\Api\Whatsapp;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Traits\WebTrait;
use Illuminate\Http\Request;

class ConversationController extends Controller
{

    use WebTrait;
    public function index()
    {
        try {
            $userId = auth()->user()->id;
            // Retrieve all conversations
            $conversations = Conversation::with('user', 'employee')->where('user_id',$userId)->get();
            return $this->data($conversations, 'Successfully retrieved data.');
        } catch (\Exception $e) {
            // Print error if any
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    // Create a new conversation
    public function store(Request $request)
    {
        try {
            // Validate input
            $request->validate([
                'employee_id' => 'sometimes|nullable',
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:255',
                'phone_sender' => 'required|string|max:255',
            ]);
            
         
        // Check and convert Arabic numbers in 'phone'
        $phone = $request->phone;
        if ($this->containsArabicNumbers($phone)) {
            $phone = $this->convertArabicNumbersToEnglish($phone);
        }

        // Check and convert Arabic numbers in 'phone_sender'
        $phoneSender = $request->phone_sender;
        if ($this->containsArabicNumbers($phoneSender)) {
            $phoneSender = $this->convertArabicNumbersToEnglish($phoneSender);
        }

        // Create the conversation
        $conversation = Conversation::create([
            'user_id' => auth()->user()->id,
            'employee_id' => $request->employee_id,
            'name' => $request->name,
            'phone' => $phone, // Use the converted phone
            'phone_sender' => $phoneSender, // Use the converted phone_sender
        ]);
           

            return $this->data($conversation, 'Successfully created data.');
        } catch (\Exception $e) {
            // Print error if any
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    private function containsArabicNumbers($input)
    {
        return preg_match('/[٠-٩]/u', $input);
    }
    
   public function convertArabicNumbersToEnglish($input)
    {
        $arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        $englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        return str_replace($arabicNumbers, $englishNumbers, $input);
    }

    // Display a specific conversation
    public function show($id)
    {
        try {
            // Find the conversation
            $conversation = Conversation::with('user', 'messages')->findOrFail($id);
            return $this->data($conversation, 'Successfully retrieved data.');
        } catch (\Exception $e) {
            // Print error if any
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Update a conversation
    public function update(Request $request, $id)
    {
        try {
            
            // Find the conversation
            $conversation = Conversation::findOrFail($id);

            // Validate input (only for existing fields in request)
            $request->validate([
                'user_id' => 'sometimes',
                'employee_id' => 'sometimes|nullable',
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:255',
            ]);

            // Update only the fields that are present in the request
            $conversation->update($request->only(['user_id', 'employee_id', 'name', 'phone']));

            return $this->data($conversation, 'Successfully updated data.');
        } catch (\Exception $e) {
            // Print error if any
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Delete a conversation
    public function destroy($id)
    {
        try {
            // Find the conversation
            $conversation = Conversation::findOrFail($id);

            // Delete the conversation
            $conversation->delete();

            return $this->data(null, 'Successfully deleted data.');
        } catch (\Exception $e) {
            // Print error if any
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
