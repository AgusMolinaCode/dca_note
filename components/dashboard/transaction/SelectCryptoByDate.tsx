import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectCryptoByDateProps {
  uniqueDates: string[];
  handleDateChange: (date: string) => void;
}

const SelectCryptoByDate: React.FC<SelectCryptoByDateProps> = ({ uniqueDates, handleDateChange }) => {
  return (
    <Select onValueChange={handleDateChange} >
      <SelectTrigger className="w-[124px] border-gray-400 text-gray-400">
        <SelectValue placeholder="Select a date" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Dates</SelectLabel>
          <SelectItem value="All">All dates</SelectItem>
          {uniqueDates.map((date) => (
            <SelectItem key={date} value={date}>
              {date}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectCryptoByDate;