import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import EventForm from '../../components/events/EventForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function CreateEvent() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link to="/events">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>
        
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        
        <CardContent>
          <EventForm />
        </CardContent>
      </Card>
    </div>
  );
}