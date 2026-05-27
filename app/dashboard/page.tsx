"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  author: { name: string | null; email: string };
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  // Fetch posts on mount and set up interval
  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          published: true,
        }),
      });

      if (response.ok) {
        setTitle("");
        setContent("");
        fetchPosts();
      } else {
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-4 items-center">
            <span className="text-muted-foreground text-sm">
              {session.user?.email}
            </span>
            <Button
              variant="outline"
              onClick={() => signOut({ redirect: true, redirectTo: "/" })}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <h3 className="text-muted-foreground text-sm">Total Posts</h3>
            <p className="text-3xl font-bold text-foreground">{posts.length}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-muted-foreground text-sm">Published</h3>
            <p className="text-3xl font-bold text-foreground">
              {posts.filter((p) => p.published).length}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-muted-foreground text-sm">Drafts</h3>
            <p className="text-3xl font-bold text-foreground">
              {posts.filter((p) => !p.published).length}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Post */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Create Post
              </h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Post content"
                    rows={4}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground"
                  >
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Post"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Recent Posts
              </h2>
              {postsLoading ? (
                <div className="text-muted-foreground">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="text-muted-foreground">No posts yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-muted-foreground">
                          Title
                        </th>
                        <th className="text-left py-3 px-2 text-muted-foreground">
                          Author
                        </th>
                        <th className="text-left py-3 px-2 text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-2 text-muted-foreground">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post) => (
                        <tr
                          key={post.id}
                          className="border-b border-border hover:bg-secondary/50"
                        >
                          <td className="py-3 px-2 text-foreground">
                            {post.title}
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">
                            {post.author.name || post.author.email}
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                post.published
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }`}
                            >
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
