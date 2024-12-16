<?php

namespace App\Http\Controllers\Api\Ticket;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function store(Request $request)
    {
        try {
            // dd('s');
            $request->validate([
                'title' => 'required|string|max:255',
                'body' => 'required|string',
                // 'status' => 'required|in:unresolved,resolved_not_solved,resolved',
                'user_id' => 'required|exists:users,id',
            ]);

            $ticket = Ticket::create([
                'title' => $request->title,
                'body' => $request->body,
                // 'status' => $request->status,
                'user_id' => $request->user_id,
            ]);

            return response()->json($ticket, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function show($id)
    {
        try {
            $ticket = Ticket::findOrFail($id);
            return response()->json($ticket, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ticket not found'], 404);
        }
    }

    public function index($id)
    {
        try {
            $ticket = Ticket::where('user_id',$id)->get();
            return response()->json($ticket, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ticket not found'], 404);
        }
    }
}
