<script lang="ts">
    import { onMount } from "svelte";
    import { fly, fade, scale } from "svelte/transition";
    import { flip } from "svelte/animate";

    interface ApiEndpoint {
        id: string;
        name: string;
        path: string;
        method: string;
        description: string | null;
        createdAt: string;
        updatedAt: string;
    }

    let endpoints: ApiEndpoint[] = [];
    let newEndpoint = {
        name: "",
        path: "",
        method: "GET",
        description: "",
    };
    let message: string = "";
    let isError: boolean = false;
    let isSubmitting: boolean = false;
    let editingEndpoint: ApiEndpoint | null = null;
    let deletingEndpoint: ApiEndpoint | null = null;
    let editForm = {
        name: "",
        path: "",
        method: "GET",
        description: "",
    };

    // Method colors for badges
    const methodColors: Record<string, string> = {
        GET: "bg-emerald-100 text-emerald-700 border-emerald-200",
        POST: "bg-purple-100 text-purple-700 border-purple-200",
        PUT: "bg-amber-100 text-amber-700 border-amber-200",
        DELETE: "bg-red-100 text-red-700 border-red-200",
        PATCH: "bg-purple-100 text-purple-700 border-purple-200",
    };

    async function fetchEndpoints() {
        try {
            const response = await fetch("/api/endpoints");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            endpoints = await response.json();
        } catch (error) {
            console.error("Failed to fetch endpoints:", error);
            showMessage("Failed to load API endpoints.", true);
        }
    }

    async function addEndpoint() {
        if (isSubmitting) return;

        message = "";
        isError = false;
        isSubmitting = true;

        try {
            const response = await fetch("/api/endpoints", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEndpoint),
            });

            if (response.status === 201) {
                const addedEndpoint = await response.json();
                endpoints = [addedEndpoint, ...endpoints];
                newEndpoint = {
                    name: "",
                    path: "",
                    method: "GET",
                    description: "",
                };
                showMessage("Endpoint created successfully!", false);
            } else {
                const errorData = await response.json();
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`,
                );
            }
        } catch (error: any) {
            console.error("Failed to add endpoint:", error);
            showMessage(error.message || "Failed to create endpoint.", true);
        } finally {
            isSubmitting = false;
        }
    }

    function showMessage(msg: string, error: boolean) {
        message = msg;
        isError = error;
        setTimeout(() => {
            message = "";
            isError = false;
        }, 4000);
    }

    // Keyboard event handlers for accessibility
    function handleModalKeydown(
        event: KeyboardEvent,
        closeFunction: () => void,
    ) {
        if (
            event.key === "Escape" ||
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            closeFunction();
        }
    }

    function startEdit(endpoint: ApiEndpoint) {
        editingEndpoint = endpoint;
        editForm = {
            name: endpoint.name,
            path: endpoint.path,
            method: endpoint.method,
            description: endpoint.description || "",
        };
    }

    function cancelEdit() {
        editingEndpoint = null;
        editForm = {
            name: "",
            path: "",
            method: "GET",
            description: "",
        };
    }

    async function saveEdit() {
        if (!editingEndpoint || isSubmitting) return;

        isSubmitting = true;
        try {
            const response = await fetch(
                `/api/endpoints/${editingEndpoint.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editForm),
                },
            );

            if (response.ok) {
                const updatedEndpoint = await response.json();
                endpoints = endpoints.map((ep) =>
                    ep.id === editingEndpoint!.id ? updatedEndpoint : ep,
                );
                showMessage("Endpoint updated successfully!", false);
                cancelEdit();
            } else {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to update endpoint",
                );
            }
        } catch (error: any) {
            console.error("Failed to update endpoint:", error);
            showMessage(error.message || "Failed to update endpoint.", true);
        } finally {
            isSubmitting = false;
        }
    }

    function confirmDelete(endpoint: ApiEndpoint) {
        deletingEndpoint = endpoint;
    }

    function cancelDelete() {
        deletingEndpoint = null;
    }

    async function deleteEndpoint() {
        if (!deletingEndpoint || isSubmitting) return;

        isSubmitting = true;
        try {
            const response = await fetch(
                `/api/endpoints/${deletingEndpoint.id}`,
                {
                    method: "DELETE",
                },
            );

            if (response.ok) {
                endpoints = endpoints.filter(
                    (ep) => ep.id !== deletingEndpoint!.id,
                );
                showMessage("Endpoint deleted successfully!", false);
                cancelDelete();
            } else {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to delete endpoint",
                );
            }
        } catch (error: any) {
            console.error("Failed to delete endpoint:", error);
            showMessage(error.message || "Failed to delete endpoint.", true);
        } finally {
            isSubmitting = false;
        }
    }

    onMount(() => {
        fetchEndpoints();
    });
</script>

<svelte:head>
    <title>PedagogiaAPI</title>
</svelte:head>

<div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50"
>
    <!-- Header -->
    <header
        class="relative overflow-hidden bg-white/80 backdrop-blur-sm border-b border-slate-200/50"
    >
        <div
            class="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5"
        ></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center">
                <h1
                    class="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-500 to-indigo-900 bg-clip-text text-transparent leading-tight py-1"
                >
                    PedagogiaAPI
                </h1>

                <p class="mt-2 text-slate-600 font-medium">
                    Build and manage your API endpoints
                </p>
            </div>
        </div>
    </header>

    <!-- Toast Messages -->
    {#if message}
        <div
            class="fixed top-4 right-4 z-50"
            in:fly={{ x: 300, duration: 300 }}
            out:fly={{ x: 300, duration: 200 }}
        >
            <div
                class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm border {isError
                    ? 'bg-red-50/90 border-red-200 text-red-700'
                    : 'bg-emerald-50/90 border-emerald-200 text-emerald-700'}"
            >
                <div
                    class="w-2 h-2 rounded-full {isError
                        ? 'bg-red-500'
                        : 'bg-emerald-500'}"
                ></div>
                <span class="font-medium">{message}</span>
            </div>
        </div>
    {/if}

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <!-- Form Section -->
            <div class="xl:col-span-2">
                <div class="sticky top-8">
                    <div
                        class="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-900/5 overflow-hidden"
                    >
                        <div
                            class="bg-gradient-to-r from-violet-600 to-violet-800 px-6 py-4"
                        >
                            <h2 class="text-xl font-semibold text-white">
                                Create New Endpoint
                            </h2>
                        </div>

                        <form
                            on:submit|preventDefault={addEndpoint}
                            class="p-6 space-y-6"
                        >
                            <!-- Name Field -->
                            <div class="space-y-2">
                                <label
                                    for="name"
                                    class="block text-sm font-semibold text-slate-700"
                                >
                                    Endpoint Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    bind:value={newEndpoint.name}
                                    required
                                    placeholder="e.g., Get Users"
                                    class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 placeholder:text-slate-400 text-slate-900"
                                />
                            </div>

                            <!-- Path Field -->
                            <div class="space-y-2">
                                <label
                                    for="path"
                                    class="block text-sm font-semibold text-slate-700"
                                >
                                    API Path
                                </label>
                                <input
                                    type="text"
                                    id="path"
                                    bind:value={newEndpoint.path}
                                    required
                                    placeholder="/api/users"
                                    class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 placeholder:text-slate-400 font-mono text-slate-900"
                                />
                            </div>

                            <!-- Method Field -->
                            <div class="space-y-2">
                                <label
                                    for="method"
                                    class="block text-sm font-semibold text-slate-700"
                                >
                                    HTTP Method
                                </label>
                                <select
                                    id="method"
                                    bind:value={newEndpoint.method}
                                    required
                                    class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 font-medium text-slate-900"
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                    <option value="PATCH">PATCH</option>
                                </select>
                            </div>

                            <!-- Description Field -->
                            <div class="space-y-2">
                                <label
                                    for="description"
                                    class="block text-sm font-semibold text-slate-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    bind:value={newEndpoint.description}
                                    rows="3"
                                    placeholder="Describe what this endpoint does..."
                                    class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         transition-all duration-200 placeholder:text-slate-400 resize-none text-slate-900"
                                ></textarea>
                            </div>

                            <!-- Submit Button -->
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                class="w-full py-3 px-6 bg-gradient-to-r from-violet-500 to-violet-800 text-white font-semibold rounded-xl
                       hover:from-violet-500 hover:to-violet-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                       shadow-lg shadow-purple-500/25"
                            >
                                {#if isSubmitting}
                                    <span
                                        class="flex items-center justify-center gap-2"
                                    >
                                        <div
                                            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                        ></div>
                                        Creating...
                                    </span>
                                {:else}
                                    Create Endpoint
                                {/if}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Endpoints List -->
            <div class="xl:col-span-3 space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-slate-900">
                        API Endpoints
                        <span
                            class="ml-2 text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full"
                        >
                            {endpoints.length}
                        </span>
                    </h2>
                </div>

                {#if endpoints.length === 0}
                    <div
                        class="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/50"
                        in:fade={{ duration: 300 }}
                    >
                        <div
                            class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center"
                        >
                            <svg
                                class="w-8 h-8 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                ></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-slate-700 mb-2">
                            No endpoints yet
                        </h3>
                        <p class="text-slate-500">
                            Create your first API endpoint using the form
                        </p>
                    </div>
                {:else}
                    <div class="space-y-4">
                        {#each endpoints as endpoint (endpoint.id)}
                            <div
                                class="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 overflow-hidden
                       hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300 group"
                                in:fly={{ y: 20, duration: 400 }}
                                animate:flip={{ duration: 300 }}
                            >
                                <div class="p-6">
                                    <div
                                        class="flex items-start justify-between mb-3"
                                    >
                                        <h3
                                            class="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors"
                                        >
                                            {endpoint.name}
                                        </h3>
                                        <span
                                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                                {methodColors[endpoint.method] ||
                                                'bg-gray-100 text-gray-700 border-gray-200'}"
                                        >
                                            {endpoint.method}
                                        </span>
                                    </div>

                                    <div class="mb-3">
                                        <code
                                            class="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-mono"
                                        >
                                            {endpoint.path}
                                        </code>
                                    </div>

                                    {#if endpoint.description}
                                        <p
                                            class="text-slate-600 mb-4 leading-relaxed"
                                        >
                                            {endpoint.description}
                                        </p>
                                    {/if}

                                    <div
                                        class="flex items-center justify-between pt-3 mt-3 border-t border-slate-100"
                                    >
                                        <div class="text-xs text-slate-400">
                                            <span
                                                >Created {new Date(
                                                    endpoint.createdAt,
                                                ).toLocaleDateString()}</span
                                            >
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <button
                                                on:click={() =>
                                                    startEdit(endpoint)}
                                                class="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                                                title="Edit endpoint"
                                                aria-label="Edit endpoint {endpoint.name}"
                                            >
                                                <svg
                                                    class="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    ></path>
                                                </svg>
                                            </button>
                                            <button
                                                on:click={() =>
                                                    confirmDelete(endpoint)}
                                                class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                title="Delete endpoint"
                                                aria-label="Delete endpoint {endpoint.name}"
                                            >
                                                <svg
                                                    class="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    ></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </main>

    <!-- Edit Modal -->
    {#if editingEndpoint}
        <div
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 150 }}
            on:click={cancelEdit}
            on:keydown={(e) => handleModalKeydown(e, cancelEdit)}
            role="button"
            aria-label="Close edit modal"
            tabindex="0"
        >
            <div
                class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
                in:scale={{ duration: 200, start: 0.95 }}
                out:scale={{ duration: 150, start: 0.95 }}
                on:click|stopPropagation
                on:keydown|stopPropagation
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            >
                <div
                    class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4"
                >
                    <h3
                        id="edit-modal-title"
                        class="text-xl font-semibold text-white"
                    >
                        Edit Endpoint
                    </h3>
                    <p id="edit-modal-description" class="sr-only">
                        Use this form to edit the API endpoint details. Press
                        Escape to close.
                    </p>
                </div>

                <form on:submit|preventDefault={saveEdit} class="p-6 space-y-4">
                    <div class="space-y-2">
                        <label
                            for="edit-name"
                            class="block text-sm font-semibold text-slate-700"
                        >
                            Endpoint Name
                        </label>
                        <input
                            type="text"
                            id="edit-name"
                            bind:value={editForm.name}
                            required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white
                                   focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   transition-all duration-200 text-slate-900"
                        />
                    </div>

                    <div class="space-y-2">
                        <label
                            for="edit-path"
                            class="block text-sm font-semibold text-slate-700"
                        >
                            API Path
                        </label>
                        <input
                            type="text"
                            id="edit-path"
                            bind:value={editForm.path}
                            required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white
                                   focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   transition-all duration-200 text-slate-900 font-mono"
                        />
                    </div>

                    <div class="space-y-2">
                        <label
                            for="edit-method"
                            class="block text-sm font-semibold text-slate-700"
                        >
                            HTTP Method
                        </label>
                        <select
                            id="edit-method"
                            bind:value={editForm.method}
                            required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white
                                   focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   transition-all duration-200 text-slate-900 font-medium"
                        >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                            <option value="PATCH">PATCH</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label
                            for="edit-description"
                            class="block text-sm font-semibold text-slate-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="edit-description"
                            bind:value={editForm.description}
                            rows="3"
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white
                                   focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                   transition-all duration-200 text-slate-900 resize-none"
                        ></textarea>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button
                            type="button"
                            on:click={cancelEdit}
                            class="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl
                                   hover:bg-slate-200 transition-all duration-200"
                            aria-label="Cancel editing endpoint"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            class="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl
                                   hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-all duration-200 shadow-lg shadow-purple-500/25"
                        >
                            {#if isSubmitting}
                                <span
                                    class="flex items-center justify-center gap-2"
                                >
                                    <div
                                        class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    ></div>
                                    Saving...
                                </span>
                            {:else}
                                Save Changes
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <!-- Delete Confirmation Modal -->
    {#if deletingEndpoint}
        <div
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 150 }}
            on:click={cancelDelete}
            on:keydown={(e) => handleModalKeydown(e, cancelDelete)}
            role="button"
            aria-label="Close delete confirmation modal"
            tabindex="0"
        >
            <div
                class="bg-white rounded-2xl shadow-2xl max-w-sm w-full"
                in:scale={{ duration: 200, start: 0.95 }}
                out:scale={{ duration: 150, start: 0.95 }}
                on:click|stopPropagation
                on:keydown|stopPropagation
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
            >
                <div class="p-6">
                    <div class="flex items-center gap-4 mb-4">
                        <div
                            class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"
                        >
                            <svg
                                class="w-6 h-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                ></path>
                            </svg>
                        </div>
                        <div>
                            <h3
                                id="delete-modal-title"
                                class="text-lg font-semibold text-slate-900"
                            >
                                Delete Endpoint
                            </h3>
                            <p
                                id="delete-modal-description"
                                class="text-slate-600"
                            >
                                This action cannot be undone. Press Escape to
                                close.
                            </p>
                        </div>
                    </div>

                    <div class="bg-slate-50 rounded-lg p-3 mb-6">
                        <p class="text-sm text-slate-600">
                            <span class="font-medium"
                                >{deletingEndpoint.name}</span
                            ><br />
                            <code class="text-xs bg-slate-200 px-2 py-1 rounded"
                                >{deletingEndpoint.method}
                                {deletingEndpoint.path}</code
                            >
                        </p>
                    </div>

                    <div class="flex gap-3">
                        <button
                            type="button"
                            on:click={cancelDelete}
                            class="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl
                                   hover:bg-slate-200 transition-all duration-200"
                            aria-label="Cancel deleting endpoint"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            on:click={deleteEndpoint}
                            disabled={isSubmitting}
                            class="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl
                                   hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-all duration-200"
                            aria-label="Confirm delete endpoint {deletingEndpoint.name}"
                        >
                            {#if isSubmitting}
                                <span
                                    class="flex items-center justify-center gap-2"
                                >
                                    <div
                                        class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    ></div>
                                    Deleting...
                                </span>
                            {:else}
                                Delete
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(body) {
        font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
        font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    }

    :global(*) {
        scroll-behavior: smooth;
    }

    /* Custom scrollbar */
    :global(::-webkit-scrollbar) {
        width: 6px;
    }

    :global(::-webkit-scrollbar-track) {
        background: transparent;
    }

    :global(::-webkit-scrollbar-thumb) {
        background: rgba(148, 163, 184, 0.3);
        border-radius: 3px;
    }

    :global(::-webkit-scrollbar-thumb:hover) {
        background: rgba(148, 163, 184, 0.5);
    }
</style>
