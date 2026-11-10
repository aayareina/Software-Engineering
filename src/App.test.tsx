// @vitest-environment jsdom
import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

afterEach(cleanup);

function setTimes(current: string, start: string, end: string) {
  fireEvent.change(screen.getByLabelText('Current time'), { target: { value: current } });
  fireEvent.change(screen.getByLabelText('Start time'), { target: { value: start } });
  fireEvent.change(screen.getByLabelText('End time'), { target: { value: end } });
}

const clickCheck = () => fireEvent.click(screen.getByRole('button', { name: /check availability/i }));
const roomButton = (name: RegExp) => screen.getByRole('button', { name });

describe('App integration', () => {
  it('asks to select a room before checking', () => {
    render(<App />);
    clickCheck();
    expect(screen.getByText('Please select a room first.')).toBeTruthy();
  });

  it('shows the empty state when no room matches (F4)', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '500' } });
    expect(screen.getByRole('status').textContent).toMatch(/no rooms match/i);
  });

  it('hides rooms that do not satisfy capacity and equipment filters (F1, F2)', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '30' } });
    fireEvent.click(screen.getByLabelText('Projector'));
    expect(screen.queryByRole('button', { name: /Library Study Room 3/ })).toBeNull();
    expect(roomButton(/Engineering Hall 101/)).toBeTruthy();
    expect(roomButton(/Innovation Lab/)).toBeTruthy();
  });

  it('reports a free interval as available', () => {
    render(<App />);
    fireEvent.click(roomButton(/Library Study Room 3/));
    setTimes('08:00', '09:00', '10:00');
    clickCheck();
    expect(screen.getByText('Available')).toBeTruthy();
  });

  it('re-evaluates the result when the selected room changes (F5)', () => {
    render(<App />);
    fireEvent.click(roomButton(/Engineering Hall 101/)); // Physics Lab 10:00–11:00
    setTimes('08:00', '10:15', '10:45');
    clickCheck();
    expect(screen.getByText('Unavailable')).toBeTruthy();

    fireEvent.click(roomButton(/Library Study Room 3/)); // free at 10:15–10:45
    expect(screen.getByText('Available')).toBeTruthy();
  });

  it('reports a blocked room as unavailable (F3)', () => {
    render(<App />);
    fireEvent.click(roomButton(/Auditorium A/));
    setTimes('08:00', '09:00', '10:00');
    clickCheck();
    expect(screen.getByText('Unavailable')).toBeTruthy();
  });
});
