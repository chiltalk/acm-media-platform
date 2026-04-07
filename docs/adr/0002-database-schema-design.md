# ADR 0002: Database Schema Design

**Status**: Accepted
**Date**: 2026-04-07
**Decision Makers**: CTO (78a41381-9fb6-4908-bd58-6ab26fca8d4e)
**Technical Story**: ACM-3 (Set up core platform infrastructure)

---

## Context

The ACM Media Platform needs a flexible database schema that supports:
- Content management (blog posts, articles)
- User profiles and authentication
- Content categorization (categories and tags)
- Media management (images, videos)
- Multi-author support
- Content workflow (draft, published, archived)
- Search functionality

### Requirements
- Relational data with clear relationships
- Row-level security for multi-tenancy
- Full-text search capabilities
- Efficient querying for common operations
- Scalability for future features

---

## Decision

We adopted a normalized relational database schema with 7 core tables using PostgreSQL via Supabase.

### Core Tables

#### 1. profiles
```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- email (TEXT, unique)
- full_name (TEXT)
- avatar_url (TEXT)
- bio (TEXT)
- role (TEXT: admin, author, editor)
- created_at, updated_at (TIMESTAMP)
```

#### 2. content
```sql
- id (UUID, PK)
- title (TEXT)
- slug (TEXT, unique)
- excerpt (TEXT)
- body (TEXT)
- featured_image (TEXT)
- author_id (UUID, FK to profiles)
- status (TEXT: draft, published, archived)
- published_at (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)
- meta_title, meta_description (TEXT)
- view_count (INTEGER)
```

#### 3. categories
```sql
- id (UUID, PK)
- name (TEXT, unique)
- slug (TEXT, unique)
- description (TEXT)
- created_at (TIMESTAMP)
```

#### 4. tags
```sql
- id (UUID, PK)
- name (TEXT, unique)
- slug (TEXT, unique)
- created_at (TIMESTAMP)
```

#### 5. content_categories (Junction table)
```sql
- content_id (UUID, FK to content)
- category_id (UUID, FK to categories)
- PK (content_id, category_id)
```

#### 6. content_tags (Junction table)
```sql
- content_id (UUID, FK to content)
- tag_id (UUID, FK to tags)
- PK (content_id, tag_id)
```

#### 7. media
```sql
- id (UUID, PK)
- name (TEXT)
- url (TEXT)
- type (TEXT: image, video, document, other)
- size, width, height (INTEGER)
- alt_text (TEXT)
- uploaded_by (UUID, FK to profiles)
- created_at (TIMESTAMP)
```

### Key Design Decisions

**1. UUIDs vs Auto-increment Integers**
- **Decision**: Use UUIDs for all primary keys
- **Rationale**: Distributed system compatibility, security (no sequential IDs), global uniqueness
- **Trade-off**: Slightly larger storage, less human-readable

**2. Junction Tables for Many-to-Many**
- **Decision**: Explicit junction tables for content-categories and content-tags
- **Rationale**: Proper normalization, efficient queries, extensibility
- **Trade-off**: Additional join complexity

**3. Slug-based URLs**
- **Decision**: Unique slugs for content, categories, and tags
- **Rationale**: SEO-friendly URLs, human-readable, permanent links
- **Trade-off**: Need to ensure uniqueness and handle collisions

**4. Status Workflow**
- **Decision**: Three-state workflow (draft, published, archived)
- **Rationale**: Simple but flexible content lifecycle
- **Trade-off**: May need additional states for complex workflows

**5. Denormalized Metadata**
- **Decision**: Store meta_title and meta_description separately
- **Rationale**: SEO optimization, content control
- **Trade-off**: Data duplication vs. performance

---

## Alternatives Considered

### NoSQL Document Database (MongoDB)
**Rejected**: MongoDB
- **Rationale**: Relational nature of content (authors, categories, tags)
- **Trade-offs**: MongoDB more flexible for evolving schemas

### Single Table with JSONB
**Rejected**: Single content table with JSONB for categories/tags
- **Rationale**: Loss of referential integrity, difficult querying
- **Trade-offs**: Simpler schema, less normalized

### SQL Auto-increment IDs
**Rejected**: Integer primary keys
- **Rationale**: Exposes sequential data, less secure
- **Trade-offs**: Smaller storage, more human-readable

---

## Consequences

### Positive
- **Data Integrity**: Foreign keys ensure referential integrity
- **Security**: Row-level security (RLS) possible with clear ownership
- **Performance**: Indexes on commonly queried columns
- **Scalability**: Normalized schema scales well
- **Flexibility**: Easy to add new relationships

### Negative
- **Complexity**: Multiple joins for some queries
- **Storage**: UUIDs take more space than integers
- **Learning Curve**: Developers need to understand relational design

### Mitigation Strategies
- **Query Complexity**: Use database views for complex queries
- **Storage**: Monitor and optimize as needed
- **Learning**: Comprehensive documentation and examples

---

## Implementation

### Phase 1: Core Schema (Complete)
- ✅ Create all tables
- ✅ Define relationships and foreign keys
- ✅ Add indexes for performance
- ✅ Implement RLS policies

### Phase 2: Optimization (Planned)
- [ ] Add database views for common queries
- [ ] Implement materialized views for analytics
- [ ] Add full-text search indexes
- [ ] Create database functions for common operations

### Phase 3: Enhancement (Future)
- [ ] Add content versioning
- [ ] Implement content scheduling
- [ ] Add advanced search capabilities
- [ ] Create content relationships (related posts)

---

## Related Decisions
- [ADR 0001: Technology Stack Selection](0001-technology-stack-selection.md) - Accepted

---

## References
- [DATABASE_SCHEMA.md](../../DATABASE_SCHEMA.md) - Complete schema documentation
- [supabase-setup.sql](../../supabase-setup.sql) - Setup script
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)

---

**Approved by**: CTO (78a41381-9fb6-4908-bd58-6ab26fca8d4e)
**Review Date**: 2026-07-07