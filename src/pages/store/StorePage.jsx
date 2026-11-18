import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { EmptyState, PageBody, PageHeader, Panel } from "@/components/common/Blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/field";
import { useClub } from "@/context/ClubContext";
import { formatRupiahFull } from "@/lib/format";

const EMPTY = { name: "", category: "Bola", price: "", stock: "" };

export function StorePage() {
  const { products, addProduct, adjustStock, removeProduct } = useClub();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Nama barang wajib diisi.");
      return;
    }
    addProduct(form);
    setForm(EMPTY);
    setError("");
    setOpen(false);
  }

  return (
    <PageBody>
      <PageHeader title="Toko" description="Stok bola, sewa raket, minuman, dan merchandise di resepsionis.">
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus />
          Barang
        </Button>
      </PageHeader>
      {products.length === 0 ? (
        <EmptyState title="Toko kosong" body="Tambah barang yang dijual di meja depan." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Panel key={product.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <Badge tone={product.stock <= 4 ? "sand" : "lime"}>{product.stock <= 4 ? "Menipis" : "Aman"}</Badge>
              </div>
              <p className="text-sm">{formatRupiahFull(product.price)}</p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button type="button" size="icon-sm" variant="outline" aria-label="Kurangi stok" onClick={() => adjustStock(product.id, -1)}>
                    <Minus />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{product.stock}</span>
                  <Button type="button" size="icon-sm" variant="outline" aria-label="Tambah stok" onClick={() => adjustStock(product.id, 1)}>
                    <Plus />
                  </Button>
                </div>
                <Button type="button" size="icon-sm" variant="ghost" aria-label="Hapus barang" onClick={() => removeProduct(product.id)}>
                  <Trash2 />
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen} title="Barang baru">
        <form className="flex flex-col gap-3" onSubmit={submit}>
          <Field label="Nama">
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <Field label="Kategori">
            <Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga">
              <Input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            </Field>
            <Field label="Stok">
              <Input type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
            </Field>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-end">
            <Button type="submit">Simpan barang</Button>
          </div>
        </form>
      </Dialog>
    </PageBody>
  );
}
