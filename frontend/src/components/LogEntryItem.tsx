import React from 'react';

type LogEntryItemProps = {
  userName: string;
  description: string;
  eventDate: string;
  location: string;
};

const LogEntryItem: React.FC<LogEntryItemProps> = ({ userName, description, eventDate, location }) => (
  <tr>
    <td>{new Date(eventDate).toLocaleString()}</td>
    <td>{userName}</td>
    <td>{description}</td>
    <td>{location}</td>
  </tr>
);

export default LogEntryItem; 