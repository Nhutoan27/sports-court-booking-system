import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Pencil, Plus, Trash2, X } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { cn } from '../../utils/cn';
import { knowledgeBaseApi } from '../../services/api/knowledgeBaseApi';

const CATEGORY_SUGGESTIONS = ['Chính sách', 'Thông tin chung'];
const CATEGORY_COLOR = { 'Chính sách': 'primary', 'Thông tin chung': 'warning' };

const EMPTY_FORM = { category: '', title: '', content: '' };

export default function KnowledgeBaseManagement() {
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState({ content: [], totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    knowledgeBaseApi
      .listAll({ page })
      .then(setPageData)
      .catch(() => setError('Không tải được danh sách kho tri thức.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const categories = useMemo(
    () => [...new Set(pageData.content.map((item) => item.category))],
    [pageData]
  );
  const filtered = useMemo(
    () => (categoryFilter === 'all' ? pageData.content : pageData.content.filter((item) => item.category === categoryFilter)),
    [pageData, categoryFilter]
  );

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
    setModalMode('create');
  };

  const openEdit = (item) => {
    setForm({ category: item.category, title: item.title, content: item.content });
    setEditingId(item.id);
    setFormError('');
    setModalMode('edit');
  };

  const closeModal = () => setModalMode(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (modalMode === 'edit') {
        await knowledgeBaseApi.update(editingId, form);
      } else {
        await knowledgeBaseApi.create(form);
        setPage(0);
      }
      closeModal();
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Lưu thất bại, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Xoá mục "${item.title}"? Nội dung sẽ không còn được chatbot dùng để trả lời nữa.`)) return;
    try {
      await knowledgeBaseApi.delete(item.id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Xoá thất bại, vui lòng thử lại.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="flex items-center gap-2.5 font-display text-3xl font-bold text-ink">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-container text-primary">
              <BookOpen className="size-5" />
            </span>
            Kho tri thức
          </h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Nội dung tri thức cho chatbot trả lời. Chatbot chỉ trả lời khi tìm thấy đoạn phù hợp —
            xoá hoặc sửa sai ở đây sẽ ảnh hưởng trực tiếp câu trả lời của chatbot.
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate} className="shrink-0">
          Thêm nội dung
        </Button>
      </div>

      {categories.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2 rounded-xl bg-surface-variant-2 p-3">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              categoryFilter === 'all' ? 'bg-primary text-white shadow-primary' : 'bg-white text-ink-muted hover:text-ink'
            )}
          >
            Tất cả
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(c)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                categoryFilter === c ? 'bg-primary text-white shadow-primary' : 'bg-white text-ink-muted hover:text-ink'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      {loading && <p className="text-sm text-ink-muted">Đang tải...</p>}
      {!loading && filtered.length === 0 && (
        <Card className="flex flex-col items-center gap-2 py-12 text-center text-ink-muted">
          <BookOpen className="size-8 text-ink-soft" />
          <p>
            {pageData.content.length === 0
              ? 'Chưa có nội dung nào trong kho tri thức. Chatbot sẽ từ chối trả lời mọi câu hỏi cho tới khi có dữ liệu.'
              : 'Không có mục nào trong danh mục này.'}
          </p>
        </Card>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card
              key={item.id}
              padded={false}
              className="flex items-start justify-between gap-4 p-5 transition-shadow hover:shadow-soft"
            >
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-2">
                  <Badge color={CATEGORY_COLOR[item.category] ?? 'neutral'} variant="soft">
                    {item.category}
                  </Badge>
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                </div>
                <p className="line-clamp-2 text-sm text-ink-muted">{item.content}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  aria-label={`Sửa ${item.title}`}
                  onClick={() => openEdit(item)}
                  className="flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-primary-container hover:text-primary"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Xoá ${item.title}`}
                  onClick={() => handleDelete(item)}
                  className="flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-danger-container hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-sm text-ink-muted">
        <span>Tổng {pageData.totalElements} mục</span>
        <Pagination page={page + 1} totalPages={pageData.totalPages || 1} onPageChange={(p) => setPage(p - 1)} />
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg animate-fade-in-up">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">
                {modalMode === 'edit' ? 'Sửa nội dung' : 'Thêm nội dung mới'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Đóng"
                className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-variant-2 hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Danh mục"
                  required
                  placeholder="VD: Chính sách"
                  list="kb-category-suggestions"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
                <datalist id="kb-category-suggestions">
                  {CATEGORY_SUGGESTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <Input
                label="Tiêu đề"
                required
                placeholder="VD: Hủy đặt sân & hoàn cọc"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-ink">Nội dung</label>
                  <span className="text-xs text-ink-soft">{form.content.length} ký tự</span>
                </div>
                <textarea
                  required
                  rows={6}
                  placeholder="Nội dung trả lời đầy đủ, viết rõ ràng — đây là đoạn văn bản chatbot sẽ trích dẫn nguyên văn."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full rounded-lg border border-outline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft transition-shadow duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>

              {formError && <p className="text-sm text-danger">{formError}</p>}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Huỷ
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

