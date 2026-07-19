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
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("top");
    const [currentPage, setCurrentPage] = useState(1);
    const [upvotedIssues, setUpvotedIssues] = useState<Set<string>>(new Set());
    const ITEMS_PER_PAGE = 5; // Show 5 issues per page

    // Load upvoted issues from local storage
    useEffect(() => {
        const stored = localStorage.getItem('upvotedIssues');
        if (stored) {
            try {
                setUpvotedIssues(new Set(JSON.parse(stored)));
            } catch (e) {
                console.error("Failed to parse stored upvotes");
            }
        }
    }, []);
    
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

    // Reply state
    const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [replyAuthor, setReplyAuthor] = useState("");
    const [isReplying, setIsReplying] = useState(false);

    // Fetch issues on load
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
        if (upvotedIssues.has(id)) return;

        // Optimistic update
        setIssues(issues.map(i => i._id === id ? { ...i, votes: i.votes + 1 } : i));
        
        const newUpvotes = new Set(upvotedIssues);
        newUpvotes.add(id);
        setUpvotedIssues(newUpvotes);
        localStorage.setItem('upvotedIssues', JSON.stringify(Array.from(newUpvotes)));
        
        try {
            const res = await fetch(`/api/issues/${id}/vote`, { method: "POST" });
            if (!res.ok) throw new Error("Failed to upvote");
        } catch (error) {
            console.error("Failed to upvote", error);
            // Revert on fail
            fetchIssues();
            newUpvotes.delete(id);
            setUpvotedIssues(newUpvotes);
            localStorage.setItem('upvotedIssues', JSON.stringify(Array.from(newUpvotes)));
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

    const handleAddReply = async (e: React.FormEvent, issueId: string, commentId: string) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        
        setIsReplying(true);
        try {
            const res = await fetch(`/api/issues/${issueId}/comment/${commentId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: replyText, author: replyAuthor })
            });
            
            if (res.ok) {
                setReplyText("");
                setReplyAuthor("");
                setReplyingToCommentId(null);
                fetchIssues(); // Refresh to get new reply
            }
        } catch (error) {
            console.error("Failed to add reply", error);
        } finally {
            setIsReplying(false);
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

    const filteredIssues = issues.filter(issue => 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedIssues = [...filteredIssues].sort((a, b) => {
        if (sortBy === 'top') {
            return b.votes - a.votes;
        } else {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    // Reset to page 1 when search query or sort order changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    const totalPages = Math.ceil(sortedIssues.length / ITEMS_PER_PAGE);
    const paginatedIssues = sortedIssues.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <main className="issues-page">
            <div className="container issues-container">
                <div className="issues-header fade-in-up">
                    <h1 className="hero-title">Community <span className="text-gradient">Feedback</span></h1>
                    <p className="hero-subtitle">Help us shape the future of Eicto. Report bugs, suggest new features, and vote on what we should build next.</p>
                </div>
                
                <div className="issues-actions-header fade-in-up">
                    <div className="search-container">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="Search issues, bugs, and features..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        className="sort-select" 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="top">Highest Voted</option>
                        <option value="latest">Newest First</option>
                    </select>

                    {!showForm && (
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowForm(true)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            New Issue
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="issue-form-container">
                        <h3>Create New Issue</h3>
                        <form className="issue-form" onSubmit={handleCreateIssue}>
                            <input 
                                type="text" 
                                placeholder="Short, descriptive title..." 
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
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Posting...' : 'Submit Issue'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="issues-list">
                    {loading ? (
                        <div className="loading">Loading issues...</div>
                    ) : issues.length === 0 ? (
                        <div className="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '15px', opacity: 0.5}}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <br/>
                            {searchQuery ? "No issues found matching your search." : "No issues posted yet. Be the first to suggest a feature!"}
                        </div>
                    ) : (
                        <>
                            {paginatedIssues.map(issue => (
                                <div key={issue._id} className="issue-card fade-in-up visible">
                                    <div className="vote-column">
                                        <button 
                                            className={`vote-btn ${upvotedIssues.has(issue._id) ? 'upvoted' : ''}`} 
                                            onClick={() => handleUpvote(issue._id)}
                                            disabled={upvotedIssues.has(issue._id)}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
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
                                            <span>Posted by <span className="author">{issue.author}</span></span>
                                            <span>•</span>
                                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                                            
                                            <button className="comment-toggle" onClick={() => toggleComments(issue._id)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                {issue.comments.length} Comments
                                            </button>
                                        </div>
                                        
                                        {expandedIssue === issue._id && (
                                            <div className="comments-section">
                                                {issue.comments.length > 0 ? (
                                                    <div className="comments-list">
                                                        {issue.comments.map(comment => (
                                                            <div key={comment._id} className="comment">
                                                                <div className="comment-author">
                                                                    {comment.author} 
                                                                    <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                                <p className="comment-text">{comment.text}</p>
                                                                
                                                                <button 
                                                                    className="reply-toggle-btn" 
                                                                    onClick={() => setReplyingToCommentId(replyingToCommentId === comment._id ? null : comment._id)}
                                                                >
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 10 20 15 15 20"></polyline><path d="M4 4v7a4 4 0 0 0 4 4h12"></path></svg>
                                                                    Reply
                                                                </button>
                                                                
                                                                {comment.replies && comment.replies.length > 0 && (
                                                                    <div className="replies-list">
                                                                        {comment.replies.map((reply: any) => (
                                                                            <div key={reply._id || new Date(reply.createdAt).getTime()} className="reply">
                                                                                <div className="comment-author">
                                                                                    {reply.author} 
                                                                                    <span className="comment-date">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                                                </div>
                                                                                <p className="comment-text">{reply.text}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {replyingToCommentId === comment._id && (
                                                                    <form className="comment-form reply-form" onSubmit={(e) => handleAddReply(e, issue._id, comment._id)}>
                                                                        <input 
                                                                            type="text" 
                                                                            placeholder="Your Name (Optional)" 
                                                                            className="input-field small"
                                                                            value={replyAuthor}
                                                                            onChange={(e) => setReplyAuthor(e.target.value)}
                                                                        />
                                                                        <div className="comment-input-row">
                                                                            <input 
                                                                                type="text" 
                                                                                placeholder="Write a reply..." 
                                                                                required 
                                                                                className="input-field"
                                                                                value={replyText}
                                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                            />
                                                                            <button type="submit" className="btn btn-primary" style={{padding: '8px 16px', fontSize: '0.9rem'}} disabled={isReplying}>Post Reply</button>
                                                                        </div>
                                                                    </form>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="no-comments">No comments yet. Start the conversation!</div>
                                                )}
                                                
                                                <form className="comment-form" onSubmit={(e) => handleAddComment(e, issue._id)}>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Your Name (Optional)" 
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
                                                        <button type="submit" className="btn btn-primary" style={{padding: '12px 24px', fontSize: '1rem'}} disabled={isCommenting}>Post</button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button 
                                        className="page-btn page-nav-btn" 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    
                                    {Array.from({ length: totalPages }).map((_, idx) => (
                                        <button 
                                            key={idx} 
                                            className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(idx + 1)}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        className="page-btn page-nav-btn" 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
