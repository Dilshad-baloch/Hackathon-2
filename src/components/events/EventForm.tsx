import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Upload } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useEventStore } from '../../stores/eventStore';
import { Database } from '../../lib/database.types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';

type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

interface EventFormProps {
  event?: Database['public']['Tables']['events']['Row'];
  isEditing?: boolean;
}

export default function EventForm({ event, isEditing = false }: EventFormProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createEvent, updateEvent, uploadImage } = useEventStore();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.image_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventInsert>({
    defaultValues: event || {
      title: '',
      description: '',
      date_time: '',
      location: '',
      category: '',
      image_url: '',
    },
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const onSubmit = async (data: EventInsert) => {
    if (!user) {
      toast.error('You must be logged in to create an event');
      return;
    }
    
    try {
      let imageUrl = event?.image_url || null;
      
      // Upload image if selected
      if (imageFile) {
        setIsUploading(true);
        const { url, error: uploadError } = await uploadImage(imageFile);
        setIsUploading(false);
        
        if (uploadError) {
          toast.error('Failed to upload image');
          return;
        }
        
        imageUrl = url;
      }
      
      // Prepare event data
      const eventData: EventInsert | EventUpdate = {
        ...data,
        image_url: imageUrl,
      };
      
      if (!isEditing) {
        // Add created_by field for new events
        eventData.created_by = user.id;
      }
      
      // Create or update event
      if (isEditing && event) {
        const { error } = await updateEvent(event.id, eventData as EventUpdate);
        
        if (error) {
          toast.error('Failed to update event');
          return;
        }
        
        toast.success('Event updated successfully');
        navigate(`/events/${event.id}`);
      } else {
        const { data: newEvent, error } = await createEvent(eventData as EventInsert);
        
        if (error) {
          toast.error('Failed to create event');
          return;
        }
        
        toast.success('Event created successfully');
        navigate(`/events/${newEvent?.id}`);
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const categoryOptions = [
    { value: 'Tech', label: 'Tech' },
    { value: 'Education', label: 'Education' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Business', label: 'Business' },
    { value: 'Health', label: 'Health' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Other', label: 'Other' },
  ];
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Event Title"
          placeholder="Enter event title"
          {...register('title', { required: 'Title is required' })}
          error={errors.title?.message}
        />
        
        <TextArea
          label="Description"
          placeholder="Enter event description"
          {...register('description', { required: 'Description is required' })}
          error={errors.description?.message}
        />
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Date and Time"
            type="datetime-local"
            {...register('date_time', { required: 'Date and time is required' })}
            error={errors.date_time?.message}
          />
          
          <Input
            label="Location"
            placeholder="Enter event location"
            {...register('location', { required: 'Location is required' })}
            error={errors.location?.message}
          />
        </div>
        
        <Select
          label="Category"
          options={categoryOptions}
          {...register('category', { required: 'Category is required' })}
          error={errors.category?.message}
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Event Image
          </label>
          
          <div className="mt-1 flex items-center">
            <label
              htmlFor="image-upload"
              className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              {imageFile ? 'Change Image' : 'Upload Image'}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>
          </div>
          
          {imagePreview && (
            <div className="mt-2">
              <div className="relative h-40 w-full overflow-hidden rounded-md">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting || isUploading}
          disabled={isSubmitting || isUploading}
        >
          {isEditing ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}