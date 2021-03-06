package com.njfu.ia.sys.mapper;


import com.njfu.ia.sys.domain.Block;
import com.njfu.ia.sys.utils.JsonUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class BlockMapperTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(BlockMapperTest.class);

    @Resource
    private BlockMapper blockMapper;

    @Test
    public void selectBlocks() throws Exception {
        List<Block> blocks = blockMapper.selectBlocks(new Block());
        LOGGER.info("blocks: {}", blocks);
    }

    @Test
    public void selectBlocksWithSections() throws Exception {
        List<Block> blocks = blockMapper.selectBlocksWithSections();
        LOGGER.info("blocks: {}", JsonUtils.toJsonString(blocks));
    }

    @Test
    public void insertBlock() throws Exception {
        Block block = new Block();

        int res = blockMapper.insertBlock(block);
        Assert.assertEquals(1, res);
    }

    @Test
    public void updateBlock() throws Exception {
        Block block = new Block();
        block.setBlockName("test");

        int res = blockMapper.updateBlock(block);
        Assert.assertEquals(1, res);
    }

    @Test
    public void deleteBlock() throws Exception {
        Block block = new Block();

        int res = blockMapper.deleteBlock(1);
        Assert.assertEquals(1, res);
    }

}