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
                return response()->json(['error' => 'The item with name ' . $name . ' does not exist'], 404);
            }

            return response()->json(['item' => $item, 'status' => 1]);
        }         
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
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
            return response()->json(['error' => 'An error occurred'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try 
        {
            $data = $request->validate([
                'name' => 'required|string',
            ]);

            // For testing only
            $data['name'] = fake()->sentence(6);

            $item = $this->model->create($data);
            return response()->json(['item' => $item, 'status' => 1]);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try 
        {
            $data = $request->validate([
                'name' => 'required|string',
            ]);

            // For testing only
            $data['name'] = fake()->sentence(7);

            $item = $this->model->findOrFail($id);
            $item->update($data);
            return response()->json(['item' => $item, 'status' => 1]);
        }
        catch (ModelNotFoundException $e) 
        {
            return response()->json(['error' => 'The item with id ' . $id . ' does not exist'], 404);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);

            // For debugging
            // return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
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

            return response()->json(['message' => 'Item deleted successfully', 'status' => 1]);
        }
        catch (ModelNotFoundException $e) 
        {
            return response()->json(['error' => 'The item with id ' . $id . ' does not exist'], 404);
        }
        catch (\Exception $e) 
        {
            Log::error($e->getMessage());
            // return response()->json(['error' => 'An error occurred'], 500);

            // For debugging
            return response()->json(['error' => 'An error occurred. ' . $e->getMessage()], 500);
        }
    }
}
