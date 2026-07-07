<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResourceDownload;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Replicates Django's ResourceDownloadViewSet (ReadOnlyModelViewSet).
 * Only GET index and GET detail — no write operations.
 */
class ResourceDownloadController extends Controller
{
    private function transform(ResourceDownload $r): array
    {
        return [
            'id'       => $r->id,
            'title'    => $r->title,
            'category' => $r->category,
            'file'     => $this->fileUrl($r->file),
            'order'    => $r->order,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            ResourceDownload::orderBy('order')
                ->get()->map(fn ($r) => $this->transform($r))->values()
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $r = ResourceDownload::find($id);
        return $r ? response()->json($this->transform($r)) : $this->notFound();
    }
}
