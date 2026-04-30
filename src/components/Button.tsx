import type { ButtonProps } from '../types';

export const Button = ({
  label,
  onClick = () => {},
  type = 'button',
  variant = 'primary',
  disabled,
  children,
}: ButtonProps) => {
  const styles = {
    primary:
      'bg-[linear-gradient(135deg,#eb6b4a_0%,#f0b44d_100%)] text-white shadow-lg shadow-orange-200/80 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-200/90',
    secondary:
      'border border-[color:var(--line)] bg-white/80 text-slate-700 backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white',
    danger:
      'bg-[linear-gradient(135deg,#be123c_0%,#e11d48_100%)] text-white shadow-lg shadow-rose-200/80 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-200/90',
  };

  return (
    <button
      className={`${styles[variant]} inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children || label}
    </button>
  );
};

export default Button;
