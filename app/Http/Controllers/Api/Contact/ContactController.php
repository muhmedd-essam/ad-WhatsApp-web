<?php

namespace App\Http\Controllers\Api\Contact;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contact;
use App\Traits\WebTrait;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Maatwebsite\Excel\Facades\Excel;

class ContactController extends Controller
{
    use WebTrait;

public function importContacts(Request $request)
{
    // Validate the request
    $request->validate([
        'file' => 'required|mimes:xlsx,csv', // Validate the file type for both Excel and CSV
        'list_name' => 'required|string', // Validate the list name
    ]);

    // Get the authenticated user
    $user = auth()->user();

    // Get the uploaded file
    $file = $request->file('file')->getRealPath();

    // Determine file type and load accordingly
    $extension = $request->file('file')->getClientOriginalExtension();

    try {
        if ($extension === 'xlsx') {
            // Load Excel file
            $spreadsheet = IOFactory::load($file);
            $sheetData = $spreadsheet->getActiveSheet()->toArray(null, true, true, true);
        } else {
            // Load CSV file
            $handle = fopen($file, 'r');
            $sheetData = [];
            while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
                $sheetData[] = $data;
            }
            fclose($handle);
        }

        // Prepare the data to insert into the database
        $contacts = [];
        $errors = [];

        foreach ($sheetData as $index => $row) {
            // Validate the name and phone number before adding to the contacts array
            $name = $row['A']; // Assuming 'A' is the name
            $phoneNumber = $row['B']; // Assuming 'B' is the phone number

            // Validate that name contains only letters and spaces, and no special characters or numbers
            if (!preg_match('/^[\pL\s]+$/u', $name)) {
                $errors[] = "Row $index: Invalid name '$name'. It should only contain letters and spaces.";
                continue; // Skip this row and continue with the next
            }

            // Validate that phone number is numeric
            if (!is_numeric($phoneNumber)) {
                $errors[] = "Row $index: Invalid phone number '$phoneNumber'. It should be numeric.";
                continue; // Skip this row and continue with the next
            }
$phone = $phoneNumber;
        if ($this->containsArabicNumbers($phone)) {
            $phone = $this->convertArabicNumbersToEnglish($phone);
        }
            // Add valid data to the contacts array
            $contacts[] = [
                'user_id' => $user->id,
                'name' => $name, // Contact's name from column A
                'phone_number' => $phone, // Contact's phone number from column B
                'list_name' => $request->list_name, // The list name provided in the form
                'created_at' => now(), // Add created_at
                'updated_at' => now(), // Add updated_at
            ];
        }

        // Insert the valid contacts in bulk
        if (!empty($contacts)) {
            Contact::insert($contacts);
        }

        // Check if there were any errors
        if (!empty($errors)) {
            return response()->json([
                'success' => "Contacts imported successfully with some errors.",
                'errors' => $errors,
            ], 200);
        }

        // If no errors, return success message
        return response()->json(['success' => 'All contacts imported successfully!'], 200);

    } catch (\Exception $e) {
        // Handle errors and return a message
        return response()->json(['error' => 'Error importing contacts: ' . $e->getMessage()], 500);
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


public function index()
{
    $contacts = Contact::where('user_id', auth()->id())->get();

    if ($contacts->isEmpty()) {
        return $this->data(404, 'No contacts found.');
    }

    // تجميع جهات الاتصال حسب list_name
    $groupedContacts = $contacts->groupBy('list_name');

    // إنشاء مصفوفة جديدة للبيانات المنظمة
    $formattedData = [];

    foreach ($groupedContacts as $listName => $items) {
        $formattedData[] = [
            'list_name' => $listName,
            'contacts' => $items
        ];
    }

    return $this->data($formattedData, 'successfully.');
}

    public function show($id)
    {
        $contact = Contact::where('user_id', auth()->id())->find($id);

        if (!$contact) {
            return $this->data(404,'No contacts found.');
        }

        return $this->data($contact, 'successfully.');
    }

    public function updateContacts(Request $request)
{
    // Validate the request
    $request->validate([
        'old_list_name' => 'required|string', // Validate the old list name
        'new_list_name' => 'required|string', // Validate the new list name
        'file' => 'nullable|mimes:xlsx,csv', // Optional: Validate the file type if provided
    ]);

    // Get the authenticated user
    $user = auth()->user();

    // Check if a file was uploaded
    if ($request->hasFile('file')) {
        // If file is provided, perform full update (delete old contacts and insert new ones)

        // Delete the old contacts from the specified list
        Contact::where('user_id', $user->id)
               ->where('list_name', $request->old_list_name)
               ->delete();

        // Get the uploaded file
        $file = $request->file('file')->getRealPath();

        // Determine file type and load accordingly
        $extension = $request->file('file')->getClientOriginalExtension();

        try {
            if ($extension === 'xlsx') {
                // Load Excel file
                $spreadsheet = IOFactory::load($file);
                $sheetData = $spreadsheet->getActiveSheet()->toArray(null, true, true, true);
            } else {
                // Load CSV file
                $handle = fopen($file, 'r');
                $sheetData = [];
                while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
                    $sheetData[] = $data;
                }
                fclose($handle);
            }

            // Prepare the data to insert into the database
            $contacts = [];

            foreach ($sheetData as $row) {
                // Assuming 'A' is the name and 'B' is the phone number
                $contacts[] = [
                    'user_id' => $user->id,
                    'name' => $row['A'], // Contact's name from column A
                    'phone_number' => $row['B'], // Contact's phone number from column B
                    'list_name' => $request->new_list_name, // The new list name provided in the form
                    'created_at' => now(), // Add created_at
                    'updated_at' => now(), // Add updated_at
                ];
            }

            // Insert the contacts in bulk
            Contact::insert($contacts);

            // Redirect back with a success message
            return $this->data($contacts, 'Contacts imported and updated successfully.');

        } catch (\Exception $e) {
            // Handle errors and return a message
            return response()->json(['error' => 'Error importing contacts: ' . $e->getMessage()], 500);
        }
    } else {
        // If no file is provided, only update the list name
        try {
            // Update the contacts' list_name where old_list_name matches
            Contact::where('user_id', $user->id)
                   ->where('list_name', $request->old_list_name)
                   ->update(['list_name' => $request->new_list_name, 'updated_at' => now()]);

            // Return success message
            return response()->json(['message' => 'List name updated successfully.'], 200);

        } catch (\Exception $e) {
            // Handle errors and return a message
            return response()->json(['error' => 'Error updating list name: ' . $e->getMessage()], 500);
        }
    }
}

    public function delete($id)
    {
        $contact = Contact::where('user_id', auth()->id())->find($id);

        if (!$contact) {
            return response()->json(['error' => 'Contact not found'], 404);
        }

        $contact->delete();

        return $this->data($contact, 'successfully delete data.');
    }
    
     public function destroyListContacts(Request $request)
    {
        try {
            $userId = auth()->user()->id;

            $request->validate([
                'list_name' => 'required',
            ]);


            // Find the conversation
            $conatctList = Contact::where('user_id',$userId)->where('list_name',$request->list_name)->get();

            foreach($conatctList as $contact){
                $contact->delete();
            }
            // Delete the conversation


            return $this->data(null, 'Successfully deleted data.');
        } catch (\Exception $e) {
            // Print error if any
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }




}
