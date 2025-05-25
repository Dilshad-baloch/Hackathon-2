import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { useParticipantStore } from '../../stores/participantStore';
import { Database } from '../../lib/database.types';
import Button from '../ui/Button';
import Input from '../ui/Input';

type ParticipantInsert = Database['public']['Tables']['participants']['Insert'];

interface ParticipantFormProps {
  eventId: string;
  onSuccess?: () => void;
}

export default function ParticipantForm({ eventId, onSuccess }: ParticipantFormProps) {
  const { user } = useAuthStore();
  const { addParticipant } = useParticipantStore();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Omit<ParticipantInsert, 'event_id' | 'added_by'>>();
  
  const onSubmit = async (data: Omit<ParticipantInsert, 'event_id' | 'added_by'>) => {
    if (!user) {
      toast.error('You must be logged in to add participants');
      return;
    }
    
    try {
      const participantData: ParticipantInsert = {
        ...data,
        event_id: eventId,
        added_by: user.id,
      };
      
      const { error } = await addParticipant(participantData);
      
      if (error) {
        if (error.code === '23505') {
          toast.error('This participant is already registered for this event');
        } else {
          toast.error('Failed to add participant');
        }
        return;
      }
      
      toast.success('Participant added successfully');
      reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding participant:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Name"
          placeholder="Enter participant name"
          {...register('participant_name', { required: 'Name is required' })}
          error={errors.participant_name?.message}
        />
        
        <Input
          label="Email"
          type="email"
          placeholder="Enter participant email"
          {...register('participant_email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.participant_email?.message}
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Add Participant
        </Button>
      </div>
    </form>
  );
}