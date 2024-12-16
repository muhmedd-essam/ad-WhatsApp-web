<?php

namespace App\Http\Controllers\Api\Whatsapp;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
     // إنشاء موظف جديد
     public function store(Request $request)
     {
         try {
             $user = auth()->user();
             // Validate input
             $request->validate([
                 'name' => 'required|string|max:255',
                 'job_title' => 'required|string|max:255',
                 'password' => 'required|string|min:6',
                 'email' => 'required|string|email|max:255|unique:employees',
                 'phone_number' => 'required|string|max:255',
                 'permissions' => 'required|array',
                 'permissions.*' => 'in:individual_messaging,group_messaging,auto_reply_and_smart_bot,contact_phrases,file_management,linked_platforms,developers'
             ]);

             // Create employee
             $employee = Employee::create([
                 'name' => $request->input('name'),
                 'job_title' => $request->input('job_title'),
                 'password' => bcrypt($request->input('password')),
                 'email' => $request->input('email'),
                 'phone_number' => $request->input('phone_number'),
                 'user_id' => $user->id,
                 'permissions' => json_encode($request->input('permissions')),
             ]);

             return response()->json(['employee' => $employee, 'message' => 'Employee created successfully']);
         } catch (\Exception $e) {
             return response()->json(['error' => 'Error creating employee: ' . $e->getMessage()], 500);
         }
     }

     // تحديث صلاحيات الموظف
     public function update(Request $request, $id)
    {
        try {

            $user = auth()->user();
            // Find the employee
            $employee = Employee::findOrFail($id);

            // Validate input (التحقق من الحقول المدخلة)
            $request->validate([
                'name' => 'sometimes|string|max:255',
                'job_title' => 'sometimes|string|max:255',
                'password' => 'sometimes|string|min:6',
                'email' => 'sometimes|string|email|max:255|unique:employees,email,' . $employee->id,
                'phone_number' => 'sometimes|string|max:255',
                'permissions' => 'sometimes|array',
                'permissions.*' => 'in:individual_messaging,group_messaging,auto_reply_and_smart_bot,contact_phrases,file_management,linked_platforms,developers'
            ]);

            // Update only the fields that are present in the request
            if ($request->has('password')) {
                // Hash password if provided
                $employee->password = bcrypt($request->input('password'));
            }

            // Update other fields
            $employee->update($request->only(['name', 'job_title', 'email', 'phone_number', $user->id]));

            // Update permissions only if provided
            if ($request->has('permissions')) {
                $employee->permissions = json_encode($request->input('permissions'));
            }

            $employee->save();

            return response()->json(['employee' => $employee, 'message' => 'Employee updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

     // عرض الموظفين
    public function index()
    {
        $user = auth()->user();
        $employees = Employee::where('user_id', $user->id)->get();
        
        if ($employees->isEmpty()) {
        return response()->json(['message' => 'No employees found'], 404);
        }
        
        return response()->json(['employees' => $employees]);
    }

    // عرض موظف معين
    public function show($id)
    {
        $employee = Employee::with('user')->find($id);

        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        return response()->json(['employee' => $employee]);
    }

    // حذف موظف
    public function destroy($id)
{
    try {
        $employee = Employee::findOrFail($id);
        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error deleting employee: ' . $e->getMessage()], 500);
    }
}
}
