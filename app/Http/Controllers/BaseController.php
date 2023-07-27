<?php

namespace App\Http\Controllers;

use App\Models\FlightClass;
use App\Models\FlightStatus;
use App\Models\JobTitle;
use App\Models\Qualification;
use App\Models\SeatLocation;
use App\Models\Skill;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BaseController extends Controller
{
    protected $model;

    public function __construct($model)
    {
        $this->model = $model;
    }

    public function show(Request $request, $name)
    {
        try 
        {
            $item = $this->model->where('name', $name)->first();

            if(!$item)
            {
                return response()->json(['error' => 'The item with name ' . $name . ' does not exist', 'status' => 0], 404);
            }

            return response()->json(['item' => $item,  'status' => 1]);
        }         
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred', 'status' => 0]);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()]);
        }
    }

    public function index(Request $request)
    {
        try 
        {
            $items = $this->model->all();
            return response()->json(['items' => $items, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred']);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()]);
        }
    }

    public function store(Request $request)
    {
        try 
        {
            $data = $request->validate([
                'name' => 'required|string',
            ]);

            // Make sure it is not a duplicate
            $existingItem = $this->model->where('name', $data['name'])->first();

            if($existingItem)
            {
                return response()->json(['error' => 'The item with name ' . $data['name'] . ' exists', 'status' => 0]);
            }
            

            $item = $this->model->create($data);

            return response()->json(['success' => 'Item added successfully', 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred']);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        try 
        {
            $data = $request->validate([
                'name' => 'required|string',
            ]);

            $item = $this->model->findOrFail($id);

            // If the details are the same
            if($item->name === $data['name'])
            {
                return response()->json(['success' => 'Item already up to date.', 'status' => 1]);
            }

            $item->update($data);

            return response()->json(['success' => 'Item updated successfully', 'status' => 1]);
        }
        catch (ModelNotFoundException $e) 
        {
            return response()->json(['error' => 'The item with id ' . $id . ' does not exist', 'status' => 0], 404);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred', 'status' => 0]);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()]);
        }
    }

    public function delete($id)
    {
        try 
        {
            $item = $this->model->findOrFail($id);
            
            // Check if the model is Skill or Qualification
            if ($item instanceof Skill || $item instanceof Qualification) {
                // Detach the skill or qualification from all employees before deleting it
                $item->employees()->detach();
            }

            // Check if the model uses SoftDeletes trait
            if ($item instanceof JobTitle || $item instanceof SeatLocation || $item instanceof FlightStatus || $item instanceof FlightClass)
            {
                // Use soft delete
                $item->delete();
            } 
            else 
            {
                // Otherwise, use regular delete
                $item->forceDelete();
            }

            return response()->json(['success' => 'Item deleted successfully', 'status' => 1]);
        }
        catch (ModelNotFoundException $e) 
        {
            return response()->json(['error' => 'The item with id ' . $id . ' does not exist', 'status' => 0]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
             return response()->json(['error' => 'An error occurred' , 'status' => 0]);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage(), 'status' => 0]);
        }
    }
}
