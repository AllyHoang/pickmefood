import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PreferenceModal = ({ isOpen, onRequestClose, onSave }) => {
  const [itemsWeight, setItemsWeight] = useState(60);
  const [urgencyWeight, setUrgencyWeight] = useState(30);
  const [pointsWeight, setPointsWeight] = useState(10);
  const [locationWeight, setLocationWeight] = useState(40);

  const handleSave = () => {
    onSave({ items: itemsWeight, urgency: urgencyWeight, points: pointsWeight, location: locationWeight });
    onRequestClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onRequestClose}>
      <DialogContent className="max-w-lg p-6 rounded-lg bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">Edit Preferences</DialogTitle>
          <DialogDescription className="mt-1 text-gray-600">Adjust the weights to change how the algorithm runs.</DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Location Weight: {locationWeight.toFixed(2)}</label>
          <Slider
            min={0}
            max={100}
            step={10}
            value={locationWeight}
            onChange={setLocationWeight}
          />
        </div>
        <div className="my-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Items Weight: {itemsWeight.toFixed(2)}</label>
          <Slider
            min={0}
            max={100}
            step={10}
            value={itemsWeight}
            onChange={setItemsWeight}
          />
        </div>
        <div className="my-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Urgency Weight: {urgencyWeight.toFixed(2)}</label>
          <Slider
            min={0}
            max={100}
            step={10}
            value={urgencyWeight}
            onChange={setUrgencyWeight}
          />
        </div>
        <div className="my-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Points Weight: {pointsWeight.toFixed(2)}</label>
          <Slider
            min={0}
            max={100}
            step={10}
            value={pointsWeight}
            onChange={setPointsWeight}
          />
        </div>
        <DialogFooter className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 font-semibold text-white bg-sky-400 rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save
          </button>
          <button
            onClick={onRequestClose}
            className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreferenceModal;
