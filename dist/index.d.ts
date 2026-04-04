import React, { ReactNode } from 'react';
import { BoxProps as BoxProps$1, TextProps as TextProps$1 } from 'ink';
import { BorderStyle, ThemeName, ColorTheme } from './themes.js';
export { borderStyles, colors, themes } from './themes.js';
import * as react_jsx_runtime from 'react/jsx-runtime';

interface BoxProps extends Omit<BoxProps$1, 'borderStyle' | 'backgroundColor'> {
    backgroundColor?: string;
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted';
    borderStyle?: BorderStyle;
    children?: React.ReactNode;
}
declare const Box: React.FC<BoxProps>;

interface TextProps extends TextProps$1 {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted' | 'default';
    children?: React.ReactNode;
}
declare const Text: React.FC<TextProps>;

interface CardProps {
    title?: string;
    footer?: string;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';
    borderStyle?: BorderStyle;
    padding?: number;
    height?: number | string;
}
declare const Card: React.FC<CardProps>;

interface BadgeProps {
    children: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
}
declare const Badge: React.FC<BadgeProps>;

declare const spinners: {
    dots: string[];
    arc: string[];
    line: string[];
    moon: string[];
    earth: string[];
    grow: string[];
    bounce: string[];
    arrow: string[];
    triangle: string[];
};
type SpinnerType = keyof typeof spinners;
interface SpinnerProps {
    type?: SpinnerType;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';
    label?: string;
}
declare const Spinner: React.NamedExoticComponent<SpinnerProps>;

interface ProgressBarProps {
    value: number;
    width?: number;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    label?: string;
    showValue?: boolean;
}
declare const ProgressBar: React.FC<ProgressBarProps>;

interface SelectOption<T = string> {
    label: string;
    value: T;
    description?: string;
    disabled?: boolean;
}
interface SelectProps<T = string> {
    options: SelectOption<T>[];
    onSelect: (value: T) => void;
    onCancel?: () => void;
    label?: string;
    visibleCount?: number;
    isActive?: boolean;
}
declare function Select<T = string>({ options, onSelect, onCancel, label, visibleCount, isActive, }: SelectProps<T>): react_jsx_runtime.JSX.Element;

interface ScrollableListProps<T> {
    id?: string;
    items: T[];
    height: number;
    renderItem: (item: T, isSelected: boolean) => React.ReactNode;
    onSelect?: (item: T) => void;
    autoScroll?: boolean;
}
declare function ScrollableList<T>({ id, items, height, renderItem, onSelect, autoScroll }: ScrollableListProps<T>): react_jsx_runtime.JSX.Element;

interface FileNode {
    name: string;
    type: 'file' | 'directory';
    children?: FileNode[];
}
interface FileTreeProps {
    nodes: FileNode[];
    onSelect?: (node: FileNode) => void;
    isActive?: boolean;
    visibleCount?: number;
}
declare const FileTree: React.FC<FileTreeProps>;

interface Column<T> {
    header: string;
    key: keyof T;
    width?: number;
    align?: 'left' | 'right';
    sortable?: boolean;
    render?: (value: any, item: T) => React.ReactNode;
}
interface DataTableProps<T> {
    id?: string;
    columns: Column<T>[];
    data: T[];
    pageSize?: number;
}
declare function DataTable<T>({ id, columns, data, pageSize }: DataTableProps<T>): react_jsx_runtime.JSX.Element;

interface CommandInputProps {
    id?: string;
    placeholder?: string;
    prefix?: string;
    suggestions?: string[];
    onSubmit: (value: string) => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    type?: 'text' | 'password';
}
declare const CommandInput: React.FC<CommandInputProps>;

interface SeparatorProps {
    orientation?: 'horizontal' | 'vertical';
    variant?: 'border' | 'primary' | 'secondary' | 'muted';
}
declare const Separator: React.FC<SeparatorProps>;

interface SparklineProps {
    values: number[];
    width?: number;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    label?: string;
}
declare const Sparkline: React.FC<SparklineProps>;

interface OverlayProps {
    children: React.ReactNode;
    isOpen: boolean;
}
declare const Overlay: React.FC<OverlayProps>;

interface PaneProps {
    children: React.ReactNode;
    title?: string;
    width?: string | number;
    height?: string | number;
    showBorder?: boolean;
}
declare const Pane: React.FC<PaneProps>;

interface MarkdownProps {
    children: string;
}
declare const Markdown: React.FC<MarkdownProps>;

interface Step {
    title: string;
    content: React.ReactNode;
}
interface StepWizardProps {
    steps: Step[];
    onComplete: () => void;
    isActive?: boolean;
}
declare const StepWizard: React.FC<StepWizardProps>;

interface SearchItem {
    label: string;
    value: string;
    category?: string;
}
interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (value: string) => void;
    items: SearchItem[];
    placeholder?: string;
}
declare const SearchModal: React.FC<SearchModalProps>;

interface CaretContextType {
    theme: ColorTheme;
    themeName: ThemeName;
    setTheme: (name: ThemeName) => void;
}
declare const CaretProvider: React.FC<{
    children: ReactNode;
    initialTheme?: ThemeName;
}>;
declare const useCaret: () => CaretContextType;

interface FocusContextType {
    focusedId: string | null;
    requestFocus: (id: string) => void;
    releaseFocus: (id: string) => void;
    isFocused: (id: string) => boolean;
}
declare const FocusProvider: React.FC<{
    children: ReactNode;
}>;
declare const useFocus: () => FocusContextType;

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}
interface NotificationContextType {
    notify: (message: string, type?: Notification['type']) => void;
}
declare const NotificationProvider: React.FC<{
    children: ReactNode;
}>;
declare const useNotify: () => NotificationContextType;

interface KeyboardOptions {
    onUp?: () => void;
    onDown?: () => void;
    onLeft?: () => void;
    onRight?: () => void;
    onEnter?: () => void;
    onEscape?: () => void;
    onTab?: () => void;
    onPageUp?: () => void;
    onPageDown?: () => void;
    onKey?: (key: string) => void;
    isActive?: boolean;
}
declare const useKeyboard: (options: KeyboardOptions) => void;

export { Badge, BorderStyle, Box, type BoxProps, Card, CaretProvider, ColorTheme, CommandInput, DataTable, type FileNode, FileTree, FocusProvider, Markdown, NotificationProvider, Overlay, Pane, ProgressBar, ScrollableList, SearchModal, Select, type SelectOption, Separator, Sparkline, Spinner, type SpinnerType, StepWizard, Text, type TextProps, ThemeName, useCaret, useFocus, useKeyboard, useNotify };
