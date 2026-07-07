<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django's ContactSubmissionViewSet with AllowPostOrIsAuthenticated.
 * POST is public. GET/PUT/PATCH/DELETE require authentication.
 * Ordered by: -submitted_at
 */
class ContactSubmissionController extends Controller
{
    private function transform(ContactSubmission $c): array
    {
        return [
            'id'           => $c->id,
            'name'         => $c->name,
            'email'        => $c->email,
            'phone'        => $c->phone         ?? '',
            'subject'      => $c->subject        ?? '',
            'message'      => $c->message,
            'is_read'      => (bool) $c->is_read,
            'submitted_at' => $this->formatDate($c->submitted_at),
        ];
    }

    public function index(Request $request): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        return response()->json(
            ContactSubmission::orderByDesc('submitted_at')
                ->get()->map(fn ($c) => $this->transform($c))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $c = ContactSubmission::find($id);
        return $c ? response()->json($this->transform($c)) : $this->notFound();
    }

    /** POST is public — no auth required */
    public function store(Request $request): JsonResponse
    {
        $c = ContactSubmission::create($request->only([
            'name', 'email', 'phone', 'subject', 'message',
        ]));

        return response()->json($this->transform($c), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $c = ContactSubmission::find($id);
        if (! $c) {
            return $this->notFound();
        }

        $c->fill($request->only(['name', 'email', 'phone', 'subject', 'message', 'is_read']))->save();

        return response()->json($this->transform($c));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if (! $this->isAuthenticated($request)) {
            return $this->unauthenticated();
        }

        $c = ContactSubmission::find($id);
        if (! $c) {
            return $this->notFound();
        }

        $c->delete();

        return response()->json(null, 204);
    }
}
