/*
 * Copyright (C) 2014-2015 Vy Nguyen
 * Github https://github.com/vy-nguyen/tvntd
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 *--------1---------2---------3---------4---------5---------6---------7---------8---------9
 */
package com.tvntd.lib;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.FileTime;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.concurrent.ExecutorService;

public class FileService
{
    private static final Logger s_log = Logger.getLogger(FileService.class.getName());

    /**
     *
     */
    static public List<Future<IterTask<Path>>>
    applyFiles(String baseDir, ExecutorService exec, int concurrency,
            IterTask<Path> item) throws Exception, InterruptedException
    {
        List<Path> files = listFiles(baseDir, null);
        return applyTask(files, exec, concurrency, item);
    }

    /**
     *
     */
    static public List<Path>
    listFiles(String root, List<Path> dir) throws IOException {
        return listFiles(Paths.get(root), dir);
    }

    static public List<Path>
    listFiles(Path root, List<Path> dir) throws IOException
    {
        List<Path> fileNames = new LinkedList<>();

        try (DirectoryStream<Path> dirStream = Files.newDirectoryStream(root)) {
            for (Path path : dirStream) {
                if (Files.isDirectory(path)) {
                    if (dir != null) {
                        dir.add(path);
                    }
                    if (Files.isSymbolicLink(path)) {
                        continue;
                    }
                    fileNames.addAll(listFiles(path, dir));
                } else {
                    fileNames.add(path);
                }
            }

        } catch(IOException e) {
            throw e;
        }
        return fileNames;
    }

    /**
     *
     */
    static public Future<List<Path>>
    listFiles(String root, List<Path> dir, ExecutorService exec)
    {
        class ListTask implements Callable<List<Path>>
        {
            private final String baseDir;
            private final List<Path> outDir;

            public ListTask(String root, List<Path> dir) {
                this.baseDir = root;
                this.outDir = dir;
            }
            public List<Path> call() throws IOException {
                return listFiles(baseDir, outDir);
            }
        };
        ListTask task = new ListTask(root, dir);
        return exec.submit(task);
    }

    /**
     *
     */
    static public byte[]
    getFileHash(File name, String algo, byte[] buffer) throws IOException
    {
        try {
            MessageDigest md = MessageDigest.getInstance(algo);
            FileInputStream fis = new FileInputStream(name);

            int nread = 0;
            while ((nread = fis.read(buffer)) != -1) {
                md.update(buffer, 0, nread);
            }
            fis.close();
            return md.digest();

        } catch(NoSuchAlgorithmException e) {
            s_log.log(Level.SEVERE, e.getMessage(), e);
        }
        return null;
    }

    /**
     *
     */
    static public byte[]
    getFileHash(Path name, String algo, ByteBuffer buffer) throws IOException
    {
        try {
            MessageDigest md = MessageDigest.getInstance(algo);
            FileChannel fc = FileChannel.open(name);

            while (true) {
                buffer.clear();
                int nread = fc.read(buffer);
                if ((nread != -1) && (nread != 0)) {
                    buffer.flip();
                    md.update(buffer);
                    continue;
                }
                break;
            }
            fc.close();
            return md.digest();

        } catch(NoSuchAlgorithmException e) {
            s_log.log(Level.SEVERE, e.getMessage(), e);
        }
        return null;
    }

    /**
     * Do async compute sha1 of the file.
     */
    static public Future<byte[]>
    getFileHashAsync(Path name, String algo, ExecutorService exec)
    {
        class HashCompute implements Callable<byte[]>
        {
            private final Path   m_name;
            private final String m_algo;

            public HashCompute(Path name, String algo) {
                this.m_name = name;
                this.m_algo = algo;
            }

            public byte[] call() throws IOException
            {
                ByteBuffer buf = FileResources.
                    getByteBuffer(Constants.FileIOBufferSize);
                return getFileHash(m_name, m_algo, buf);
            }
        }
        return exec.submit(new HashCompute(name, algo));
    }

    /**
     *
     */
    static public final FileChannel
    createFile(Path path, Set<? extends OpenOption> opt,
            FileAttribute<Set<PosixFilePermission>> perm) throws IOException
    {
        Path parent = path.getParent();
        if ((parent != null) && !Files.exists(parent)) {
            Files.createDirectories(parent);
        }
        Files.deleteIfExists(path);
        return FileChannel.open(path, opt, perm);
    }

    /**
     *
     */
    static public final byte[]
    copyAndHashFile(Path src, Path dest, String algo) throws IOException
    {
        MessageDigest md = null;
        if (algo != null) {
            try {
                md = MessageDigest.getInstance(algo);
            } catch(NoSuchAlgorithmException e) {
                s_log.log(Level.SEVERE, e.getMessage(), e);
            }
        }
        ByteBuffer buff = FileResources.getByteBuffer(1 << 20);
        FileChannel sfc = FileChannel.open(src);
        Set<PosixFilePermission> perm = Files.getPosixFilePermissions(src);
        FileChannel dfc = createFile(dest, EnumSet.of(
                    StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING,
                    StandardOpenOption.WRITE),
                PosixFilePermissions.asFileAttribute(perm));

        while (true) {
            buff.clear();
            int nread = sfc.read(buff);
            if ((nread != -1) && (nread != 0)) {
                buff.flip();
                while (buff.hasRemaining()) {
                    dfc.write(buff);
                }
                if (md != null) {
                    buff.rewind();
                    md.update(buff);
                }
                continue;
            }
            break;
        }
        // Always set mtime be the same as the source.
        FileTime orig = Files.getLastModifiedTime(src);
        Files.setLastModifiedTime(dest, orig);

        sfc.close();
        dfc.close();
        if (md != null) {
            return md.digest();
        }
        return null;
    }

    /**
     *
     */
    static public final <T, S extends IterTask<T>> List<Future<S>>
    applyTask(List<T> fileList, ExecutorService exec, int concurrency, IterTask<T> item)
        throws Exception, InterruptedException
    {
        class BatchTask implements Callable<S>
        {
            IterTask<T> context;

            public BatchTask(IterTask<T> ctx)
            {
                this.context = ctx;
                context.setCurrentItem(null);
                context.setWorkList(new LinkedList<T>());
            }

            @SuppressWarnings("unchecked")
            public S call() throws Exception, InterruptedException
            {
                List<T> fileList = context.getWorkList();
                for (T sp : fileList) {
                    context.setCurrentItem(sp);
                    context.call();
                }
                return (S) context;
            }
        }
        List<Future<S>> result = new LinkedList<>();
        ArrayList<BatchTask> tasks = new ArrayList<>();

        if (fileList.size() < concurrency) {
            concurrency = fileList.size();
        }
        tasks.add(new BatchTask(item));
        for (int i = 1; i < concurrency; i++) {
            tasks.add(new BatchTask(item.cloneInstance()));
        }
        int idx = 0;
        for (T sp : fileList) {
            BatchTask t = tasks.get(idx);
            idx = (idx + 1) % concurrency;
            t.context.getWorkList().add(sp);
        }
        /* Each task now has a list of work items to work independently. */
        for (BatchTask t : tasks) {
            result.add(exec.submit(t));
        }
        return result;
    }

    /**
     *
     */
    static public final boolean
    renameFile(String fileFrom, String fileTo)
    {
        File from = new File(fileFrom);
        File to = new File(fileTo);

        return from.renameTo(to);
    }

    static public final boolean
    renameFile(Path fileFrom, Path fileTo)
    {
        File from = fileFrom.toFile();
        File to = fileTo.toFile();
        return from.renameTo(to);
    }

    static public abstract class IterTask<Item> implements Callable<IterTask<Item>>
    {
        protected Item currentItem;
        protected List<Item> workList;

        public abstract IterTask<Item> cloneInstance();
        public void setCurrentItem(Item item) { currentItem = item; }
        public void setWorkList(List<Item> list) { workList = list; }
        public List<Item> getWorkList() { return workList; }
    }
}
