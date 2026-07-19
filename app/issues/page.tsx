"use client";

import { useState, useEffect } from "react";
import "./Issues.css";

interface Comment {
    _id: string;
    text: string;
    author: string;
    createdAt: string;
}

interface Issue {
    _id: string;
    title: string;
    description: string;
    author: string;
    votes: number;
    status: string;
    comments: Comment[];
    createdAt: string;
}

export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Comment state
    const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");
    const [commentAuthor, setCommentAuthor] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);

    useEffect(() => {
        fetchIssues();

        // Intersection Observer for scroll animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        setTimeout(() => {
            document.querySelectorAll('.fade-in-up').forEach(element => {
                observer.observe(element);
            });
        }, 100);
        
        return () => observer.disconnect();
    }, []);

    const fetchIssues = async () => {
        try {
            const res = await fetch("/api/issues");
            if (res.ok) {
                const data = await res.json();
                setIssues(data);
            }
        } catch (error) {
            console.error("Failed to fetch issues", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/issues", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, author })
            });
            if (res.ok) {
                setTitle("");
                setDescription("");
                setAuthor("");
                setShowForm(false);
                fetchIssues(); // Refresh list
            }
        } catch (error) {
            console.error("Failed to create issue", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpvote = async (id: string) => {
        // Optimistic update
        setIssues(issues.map(i => i._id === id ? { ...i, votes: i.votes + 1 } : i));
        
        try {
            await fetch(`/api/issues/${id}/vote`, { method: "POST" });
        } catch (error) {
            console.error("Failed to upvote", error);
            // Revert on fail
            fetchIssues();
        }
    };

    const handleAddComment = async (e: React.FormEvent, issueId: string) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        
        setIsCommenting(true);
        try {
            const res = await fetch(`/api/issues/${issueId}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: commentText, author: commentAuthor })
            });
            
            if (res.ok) {
                setCommentText("");
                setCommentAuthor("");
                fetchIssues(); // Refresh to get new comment
            }
        } catch (error) {
            console.error("Failed to add comment", error);
        } finally {
            setIsCommenting(false);
        }
    };

    const toggleComments = (id: string) => {
        if (expandedIssue === id) {
            setExpandedIssue(null);
        } else {
            setExpandedIssue(id);
            setCommentText("");
            setCommentAuthor("");
        }
    };

    return (
        <main className="issues-page">
            <div className="container issues-container">
                <div className="issues-header fade-in-up">
                    <h1 className="hero-title">Community <span className="text-gradient">Feedback</span></h1>
                    <p className="hero-subtitle">Help us improve Eicto. Post issues, suggest features, and vote on what we should build next.</p>
                    
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                        style={{ marginTop: '20px' }}
                    >
                        {showForm ? 'Cancel' : 'Submit Feedback'}
                    </button>
                </div>

                {showForm && (
                    <form className="glass-panel issue-form fade-in-up" onSubmit={handleCreateIssue}>
                        <h3>New Issue or Feature Request</h3>
                        <input 
                            type="text" 
                            placeholder="Title (e.g. Dark mode isn't working)" 
                            required 
                            className="input-field"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea 
                            placeholder="Describe the issue or feature in detail..." 
                            required 
                            className="input-field textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Your Name (Optional)" 
                            className="input-field"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Posting...' : 'Post Issue'}
                        </button>
                    </form>
                )}

                <div className="issues-list fade-in-up">
                    {loading ? (
                        <div className="loading">Loading issues...</div>
                    ) : issues.length === 0 ? (
                        <div className="empty-state">No issues posted yet. Be the first!</div>
                    ) : (
                        issues.map(issue => (
                            <div key={issue._id} className="glass-panel issue-card">
                                <div className="issue-main">
                                    <div className="vote-column">
                                        <button className="vote-btn" onClick={() => handleUpvote(issue._id)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                        </button>
                                        <span className="vote-count">{issue.votes}</span>
                                    </div>
                                    <div className="issue-content">
                                        <div className="issue-title-row">
                                            <h3 className="issue-title">{issue.title}</h3>
                                            <span className={`status-badge ${issue.status.toLowerCase().replace(' ', '-')}`}>{issue.status}</span>
                                        </div>
                                        <p className="issue-desc">{issue.description}</p>
                                        <div className="issue-meta">
                                            Posted by <span className="author">{issue.author}</span> • {new Date(issue.createdAt).toLocaleDateString()}
                                            <button className="comment-toggle" onClick={() => toggleComments(issue._id)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                {issue.comments.length} Comments
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {expandedIssue === issue._id && (
                                    <div className="comments-section">
                                        {issue.comments.length > 0 ? (
                                            <div className="comments-list">
                                                {issue.comments.map(comment => (
                                                    <div key={comment._id} className="comment">
                                                        <div className="comment-author">{comment.author} <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span></div>
                                                        <p className="comment-text">{comment.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="no-comments">No comments yet.</div>
                                        )}
                                        
                                        <form className="comment-form" onSubmit={(e) => handleAddComment(e, issue._id)}>
                                            <input 
                                                type="text" 
                                                placeholder="Name (Optional)" 
                                                className="input-field small"
                                                value={commentAuthor}
                                                onChange={(e) => setCommentAuthor(e.target.value)}
                                            />
                                            <div className="comment-input-row">
                                                <input 
                                                    type="text" 
                                                    placeholder="Write a comment..." 
                                                    required 
                                                    className="input-field"
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                />
                                                <button type="submit" className="btn btn-nav" disabled={isCommenting}>Post</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
