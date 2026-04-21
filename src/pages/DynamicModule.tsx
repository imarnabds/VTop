import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchModuleData } from '../services/api';

export default function DynamicModule() {
  const { category, submenu } = useParams<{ category: string, submenu: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category || !submenu) return;
    
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchModuleData(category, submenu)
      .then((res) => {
        if (isMounted) {
          if (res.success) {
            setData(res.payload);
          } else {
            setError(res.message || 'Failed to load data.');
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Backend server is offline or unreachable. Please run npm run dev from the root.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [category, submenu]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading system resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Connection Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Render Strategy based on Schema Type
  const renderContent = () => {
    switch (data.type) {
      case 'table':
        return (
          <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-card-light)', borderBottom: '2px solid var(--border-color)' }}>
                  {data.columns.map((col: string, idx: number) => (
                    <th key={idx} style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.data.map((row: any, rIdx: number) => (
                  <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                    {data.columns.map((col: string, cIdx: number) => (
                      <td key={cIdx} style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
                {data.data.length === 0 && (
                  <tr>
                    <td colSpan={data.columns.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case 'card':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {Object.entries(data.data).map(([key, value]) => (
              <div key={key} style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {key}
                </div>
                <div style={{ fontSize: '1.125rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  {value as React.ReactNode}
                </div>
              </div>
            ))}
          </div>
        );

      case 'form':
        return (
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', maxWidth: '600px' }}>
            <form onSubmit={(e) => { e.preventDefault(); alert('Form submitted to independent backend successfully!'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {data.fields.map((field: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>{field.label}</label>
                  {field.type === 'select' ? (
                    <select 
                      style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select {field.label}</option>
                      {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea 
                      style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                      placeholder={`Enter ${field.label}...`}
                    />
                  ) : (
                    <input 
                      type={field.type} 
                      readOnly={field.readOnly}
                      defaultValue={field.defaultValue}
                      placeholder={`Enter ${field.label}`}
                      style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: field.readOnly ? 'var(--bg-main-dark)' : 'var(--bg-main)', color: 'var(--text-main)', outline: 'none', opacity: field.readOnly ? 0.7 : 1 }}
                    />
                  )}
                </div>
              ))}
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="submit" 
                  style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        );

      case 'placeholder':
      default:
        return (
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '3rem 2rem', borderRadius: '12px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Section Under Construction</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>{data.message}</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="section-header" style={{ marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{data.title}</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <span style={{ textTransform: 'capitalize' }}>{category?.replace('-', ' ')}</span>
          <span>/</span>
          <span style={{ color: 'var(--primary)' }}>{data.title}</span>
        </div>
      </div>

      <div className="module-content-area" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        {renderContent()}
      </div>
    </div>
  );
}
