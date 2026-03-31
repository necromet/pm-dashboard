import React, { useState, useMemo } from 'react';
import { clients } from '../../data/mockData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const contentTypeColors = {
  feed: { bg: 'bg-blue-500', light: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
  story: { bg: 'bg-purple-500', light: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
  reel: { bg: 'bg-pink-500', light: 'bg-pink-100 text-pink-700', dot: 'bg-pink-400' },
  carousel: { bg: 'bg-amber-500', light: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function ContentCalendar({ tasks }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2); // March = index 2
  const [selectedDay, setSelectedDay] = useState(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const tasksByDay = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      const d = new Date(task.dueDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(task);
      }
    });
    return map;
  }, [tasks, year, month]);

  const goToPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const goToNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const selectedTasks = selectedDay ? tasksByDay[selectedDay] || [] : [];

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <button
            onClick={goToNext}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 text-xs text-gray-500 border-b border-gray-50">
        {Object.entries(contentTypeColors).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
            <span className="capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">
              {d}
            </div>
          ))}

          {/* Empty cells for days before the 1st */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px]" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayTasks = tasksByDay[day] || [];
            const isToday = isCurrentMonth && today.getDate() === day;
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`min-h-[80px] rounded-lg border p-1.5 text-left transition-colors ${
                  isSelected
                    ? 'border-blue-400 bg-blue-50'
                    : isToday
                    ? 'border-blue-200 bg-blue-50/50'
                    : 'border-gray-100 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isToday
                      ? 'bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center'
                      : 'text-gray-700'
                  }`}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayTasks.slice(0, 3).map((task) => {
                    const colors = contentTypeColors[task.contentType] || contentTypeColors.feed;
                    const client = clients.find((c) => c.id === task.clientId);
                    return (
                      <div
                        key={task.id}
                        className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate ${colors.light}`}
                        title={`${client?.name}: ${task.title}`}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-gray-400 px-1">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      {selectedDay && selectedTasks.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Tasks due {monthNames[month]} {selectedDay}, {year}
          </h4>
          <div className="space-y-2">
            {selectedTasks.map((task) => {
              const client = clients.find((c) => c.id === task.clientId);
              const colors = contentTypeColors[task.contentType] || contentTypeColors.feed;
              return (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.dot} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      {client?.logo} {client?.name} — {task.contentType} — {task.priority}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
