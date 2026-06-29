'use client';
import { useState, useEffect } from 'react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    fetch('http://127.0.0.1:8000/api/reviews/')
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id: number, currentStatus: boolean) => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      alert('You must be logged in.');
      return;
    }

    const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ is_approved: !currentStatus })
    });
    
    if (res.ok) {
      fetchReviews();
    } else {
      alert('Failed to update review status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    
    if (res.ok) {
      fetchReviews();
    } else {
      alert('Failed to delete review.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Reviews</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No reviews found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase">
                <th className="py-3 px-6 font-semibold">Reviewer</th>
                <th className="py-3 px-6 font-semibold">Rating</th>
                <th className="py-3 px-6 font-semibold">Status</th>
                <th className="py-3 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-gray-900 font-medium">
                    {review.name}
                    {review.designation && <span className="block text-xs text-gray-500 font-normal">{review.designation}</span>}
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-bold">{review.rating} / 5</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${review.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleToggleApproval(review.id, review.is_approved)}
                      className={`text-sm font-medium mr-4 ${review.is_approved ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}`}
                    >
                      {review.is_approved ? 'Revoke' : 'Approve'}
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
