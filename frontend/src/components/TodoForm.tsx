import { useState } from "react";
import type { FormEvent } from "react";
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from "../constants";

interface TodoFormProps {
  onCreate: (title: string, description: string | null) => Promise<boolean>;
}

export function TodoForm({ onCreate }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim().length > 0 && !submitting;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const created = await onCreate(title.trim(), description.trim() || null);
      if (created) {
        setTitle("");
        setDescription("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={(e) => void handleSubmit(e)}>
      <input
        className="input"
        placeholder="Что нужно сделать?"
        value={title}
        maxLength={TITLE_MAX_LENGTH}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="input"
        placeholder="Описание (необязательно)"
        value={description}
        maxLength={DESCRIPTION_MAX_LENGTH}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="button" type="submit" disabled={!canSubmit}>
        Добавить
      </button>
    </form>
  );
}
