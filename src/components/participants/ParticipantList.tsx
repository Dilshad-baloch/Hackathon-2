import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { useParticipantStore } from '../../stores/participantStore';
import { Database } from '../../lib/database.types';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';

type Participant = Database['public']['Tables']['participants']['Row'];
type Event = Database['public']['Tables']['events']['Row'];

interface ParticipantListProps {
  participants: Participant[];
  event: Event;
}

export default function ParticipantList({ participants, event }: ParticipantListProps) {
  const { user, profile } = useAuthStore();
  const { removeParticipant } = useParticipantStore();
  const [currentPage, setCurrentPage] = useState(1);
  const participantsPerPage = 10;
  
  // Calculate pagination
  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
  const currentParticipants = participants.slice(indexOfFirstParticipant, indexOfLastParticipant);
  const totalPages = Math.ceil(participants.length / participantsPerPage);
  
  const handleRemove = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this participant?')) {
      return;
    }
    
    try {
      const { error } = await removeParticipant(id);
      
      if (error) {
        toast.error('Failed to remove participant');
        return;
      }
      
      toast.success('Participant removed successfully');
    } catch (error) {
      console.error('Error removing participant:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const canManageParticipants = 
    user && (profile?.role === 'admin' || event.created_by === user.id);
  
  if (participants.length === 0) {
    return (
      <EmptyState
        type="participants"
        title="No participants yet"
        description="There are no participants registered for this event yet."
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Added On
              </th>
              {canManageParticipants && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentParticipants.map((participant) => (
              <tr key={participant.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {participant.participant_name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {participant.participant_email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(participant.added_at).toLocaleDateString()}
                </td>
                {canManageParticipants && (
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(participant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}