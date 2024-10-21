--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE schedule_site;
--
-- Name: schedule_site; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE schedule_site WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';


ALTER DATABASE schedule_site OWNER TO postgres;

\connect schedule_site

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classes (
    class_id integer NOT NULL,
    subject character varying(100) NOT NULL,
    teacher character varying(100) NOT NULL,
    group_id integer
);


ALTER TABLE public.classes OWNER TO postgres;

--
-- Name: classes_class_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.classes_class_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.classes_class_id_seq OWNER TO postgres;

--
-- Name: classes_class_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.classes_class_id_seq OWNED BY public.classes.class_id;


--
-- Name: days_of_week; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.days_of_week (
    day_id integer NOT NULL,
    day_name character varying(20) NOT NULL
);


ALTER TABLE public.days_of_week OWNER TO postgres;

--
-- Name: days_of_week_day_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.days_of_week_day_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.days_of_week_day_id_seq OWNER TO postgres;

--
-- Name: days_of_week_day_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.days_of_week_day_id_seq OWNED BY public.days_of_week.day_id;


--
-- Name: faculties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculties (
    faculty_id integer NOT NULL,
    faculty_name character varying(100) NOT NULL
);


ALTER TABLE public.faculties OWNER TO postgres;

--
-- Name: faculties_faculty_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faculties_faculty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faculties_faculty_id_seq OWNER TO postgres;

--
-- Name: faculties_faculty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faculties_faculty_id_seq OWNED BY public.faculties.faculty_id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    group_id integer NOT NULL,
    group_code character varying(20) NOT NULL,
    faculty_id integer
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.groups_group_id_seq OWNER TO postgres;

--
-- Name: groups_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_group_id_seq OWNED BY public.groups.group_id;


--
-- Name: schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule (
    schedule_id integer NOT NULL,
    week_id integer,
    day_id integer,
    class_id integer,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL
);


ALTER TABLE public.schedule OWNER TO postgres;

--
-- Name: schedule_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schedule_schedule_id_seq OWNER TO postgres;

--
-- Name: schedule_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_schedule_id_seq OWNED BY public.schedule.schedule_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(100) NOT NULL,
    full_name character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    group_id integer,
    is_admin boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: weeks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weeks (
    week_id integer NOT NULL,
    week_number integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL
);


ALTER TABLE public.weeks OWNER TO postgres;

--
-- Name: weeks_week_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.weeks_week_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.weeks_week_id_seq OWNER TO postgres;

--
-- Name: weeks_week_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.weeks_week_id_seq OWNED BY public.weeks.week_id;


--
-- Name: classes class_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes ALTER COLUMN class_id SET DEFAULT nextval('public.classes_class_id_seq'::regclass);


--
-- Name: days_of_week day_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.days_of_week ALTER COLUMN day_id SET DEFAULT nextval('public.days_of_week_day_id_seq'::regclass);


--
-- Name: faculties faculty_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties ALTER COLUMN faculty_id SET DEFAULT nextval('public.faculties_faculty_id_seq'::regclass);


--
-- Name: groups group_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN group_id SET DEFAULT nextval('public.groups_group_id_seq'::regclass);


--
-- Name: schedule schedule_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule ALTER COLUMN schedule_id SET DEFAULT nextval('public.schedule_schedule_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: weeks week_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weeks ALTER COLUMN week_id SET DEFAULT nextval('public.weeks_week_id_seq'::regclass);


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classes (class_id, subject, teacher, group_id) FROM stdin;
1	1	1	\N
2	1	1	\N
3	1	1	1
4	2	2	1
\.


--
-- Data for Name: days_of_week; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.days_of_week (day_id, day_name) FROM stdin;
1	Понедельник
2	Вторник
3	Среда
4	Четверг
5	Пятница
6	Суббота
7	Воскресенье
\.


--
-- Data for Name: faculties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faculties (faculty_id, faculty_name) FROM stdin;
1	мехмат
2	Филфак
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (group_id, group_code, faculty_id) FROM stdin;
1	ПМИ-2	1
2	ПМИ-1	1
3	ЛИТ-1	2
\.


--
-- Data for Name: schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule (schedule_id, week_id, day_id, class_id, start_time, end_time) FROM stdin;
6	1	1	3	01:01:00	01:02:00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, full_name, password, group_id, is_admin) FROM stdin;
2	ahahaha@dadada.ru	Admin	$2b$10$2qHUiic9m7J356CakZ95COt08pzMBpqO6fJkzDSuxlQEzFeP7UcYm	1	t
3	tsheina@yandex.ru	ahahaha@dadada.ru	$2b$10$qFwknpD9jMFqHDCPHHYclezaPtUBmUBxA6EGX7MgN7Iwr3FOGvD3q	2	f
\.


--
-- Data for Name: weeks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weeks (week_id, week_number, start_date, end_date) FROM stdin;
1	1	2024-10-21	2024-10-27
2	2	2024-10-21	2024-10-27
3	3	2024-10-21	2024-10-27
4	4	2024-10-21	2024-10-27
5	5	2024-10-21	2024-10-27
6	6	2024-10-21	2024-10-27
7	7	2024-10-21	2024-10-27
8	8	2024-10-21	2024-10-27
9	9	2024-10-21	2024-10-27
10	10	2024-10-21	2024-10-27
11	11	2024-10-21	2024-10-27
12	12	2024-10-21	2024-10-27
13	13	2024-10-21	2024-10-27
14	14	2024-10-21	2024-10-27
15	15	2024-10-21	2024-10-27
16	16	2024-10-21	2024-10-27
17	17	2024-10-21	2024-10-27
18	18	2024-10-21	2024-10-27
19	19	2024-10-21	2024-10-27
20	20	2024-10-21	2024-10-27
21	21	2024-10-21	2024-10-27
22	22	2024-10-21	2024-10-27
23	23	2024-10-21	2024-10-27
24	24	2024-10-21	2024-10-27
25	25	2024-10-21	2024-10-27
26	26	2024-10-21	2024-10-27
27	27	2024-10-21	2024-10-27
28	28	2024-10-21	2024-10-27
29	29	2024-10-21	2024-10-27
30	30	2024-10-21	2024-10-27
31	31	2024-10-21	2024-10-27
\.


--
-- Name: classes_class_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classes_class_id_seq', 4, true);


--
-- Name: days_of_week_day_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.days_of_week_day_id_seq', 7, true);


--
-- Name: faculties_faculty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faculties_faculty_id_seq', 2, true);


--
-- Name: groups_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_group_id_seq', 3, true);


--
-- Name: schedule_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_schedule_id_seq', 6, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- Name: weeks_week_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.weeks_week_id_seq', 31, true);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (class_id);


--
-- Name: days_of_week days_of_week_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.days_of_week
    ADD CONSTRAINT days_of_week_pkey PRIMARY KEY (day_id);


--
-- Name: faculties faculties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT faculties_pkey PRIMARY KEY (faculty_id);


--
-- Name: groups groups_group_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_group_code_key UNIQUE (group_code);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (group_id);


--
-- Name: schedule schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_pkey PRIMARY KEY (schedule_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: weeks weeks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weeks
    ADD CONSTRAINT weeks_pkey PRIMARY KEY (week_id);


--
-- Name: classes classes_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id);


--
-- Name: groups groups_faculty_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES public.faculties(faculty_id);


--
-- Name: schedule schedule_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(class_id);


--
-- Name: schedule schedule_day_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_day_id_fkey FOREIGN KEY (day_id) REFERENCES public.days_of_week(day_id);


--
-- Name: schedule schedule_week_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule
    ADD CONSTRAINT schedule_week_id_fkey FOREIGN KEY (week_id) REFERENCES public.weeks(week_id);


--
-- Name: users users_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(group_id);


--
-- PostgreSQL database dump complete
--

